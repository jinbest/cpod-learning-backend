module.exports = {


  friendlyName: 'Reindex vocab',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    let index = {
      model: 'vocabulary',
      elasticModel: 'vocabulary',
      elasticIndex: 'vocabulary-search-index',
      elasticRecord: [
        'id',
        'simplified', // Simplified
        'pinyin', // Pinyin
        'pinyin_tones',
        'definitions', // English
        'traditional', // Traditional
        'data',
      ],
      idColumn: 'id'
    };

    let errors = [];

    const convert = require('pinyin-tone-converter');

    await new Promise(async (resolve, reject) => {

      // await sails.hooks.elastic.client.indices.delete({index: index.elasticIndex})
      //   .catch();

      sails.log.info('Index Deleted');

      let vocabulary = require('../../../lib/cedict_sitemaps.json');

      sails.log.info(vocabulary.length);

      let total = vocabulary.length;

      let batch = 10;

      let bulkCount = Math.ceil(total / batch);

      sails.log.info(`Records Fetched in ${bulkCount} Batches`);

      for (let i = 0; i < bulkCount; i++) {

        let records = vocabulary.slice(i * batch, (i + 1) * batch);

        sails.log.info(`Records Pooled Batch: ${i + 1}`);

        let commands = [];
        let action = {
          index: {
            _index: index.elasticIndex,
            _type: index.elasticIndex
          }
        };

        await asyncForEach(records,async (record) => {
          let indexRecord = {};

          record.id = `${record.simplified}`;
          record.pinyin_tones = convert.convertPinyinTones(record.pinyin);
          record.data = JSON.stringify(await sails.helpers.dictionary.getDetails(record.simplified));

          index.elasticRecord.forEach(key => {
            indexRecord[key] = record[key];
          });
          commands.push(action);
          commands.push(indexRecord);
        });

        sails.log.info('Records Prepared');

        await sails.hooks.elastic.client.bulk({refresh: 'true', body: commands})
          // .then(() => sails.log.info(`Records Processed Batch: ${i + 1}`))
          .catch(error => sails.hooks.bugsnag.notify(error));

        sails.log.info('Records Pushed');

      }

      if (errors.length > 0) {
        reject(errors[0])
      } else {
        resolve('done')
      }

    });
  }


};

