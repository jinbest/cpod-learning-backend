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

    let index = {
      model: 'vocabulary',
      elasticModel: 'vocabulary',
      elasticIndex: 'vocabulary',
      elasticRecord: [
        'id',
        'simplified', // Simplified
        'pronunciation', // Pinyin
        'pronunciation_tones',
        'definitions', // English
        'traditional' // Traditional
      ],
      idColumn: 'id'
    };

    let errors = [];

    const convert = require('pinyin-tone-converter');

    await new Promise(async (resolve, reject) => {

      await sails.hooks.elastic.client.indices.delete({index: index.elasticIndex}, (error, response) => {
        if (error) {
          // sails.log.error(error);
        }
      });

      sails.log.info('Index Deleted');

      let vocabulary = require('../../../lib/cedict.json');

      sails.log.info(vocabulary.length);

      let total = vocabulary.length;

      // let total = 10000;

      let batch = 100;

      let bulkCount = Math.ceil(total / batch);

      sails.log.info(`Records Fetched in ${bulkCount} Batches`);

      for (let i = 0; i < bulkCount; i++) {

        await setTimeout(async () => {
          let records = vocabulary.slice(i * batch, (i + 1) * batch);

          sails.log.info(`Records Pooled Batch: ${i + 1}`);

          let commands = [];
          let action = {
            index: {
              _index: index.elasticIndex,
              _type: index.elasticIndex
            }
          };

          records.forEach(record => {
            let indexRecord = {};

            record.id = `${i}-${record.simplified}`;
            record.pronunciation_tones = convert.convertPinyinTones(record.pronunciation);

            index.elasticRecord.forEach(key => {
              indexRecord[key] = record[key];
            });
            commands.push(action);
            commands.push(indexRecord);
          });

          sails.log.info('Records Prepared');

          await new Promise(async (resolve, reject) => {
            // run bulk command
            await sails.hooks.elastic.client.bulk({body: commands}, (error, response) => {
              if (error) {
                sails.log.error(error);
                errors.push(error);
                reject(error);
              } else {
                sails.log.info(`Records Processed Batch: ${i + 1}`);
                resolve(response)
              }
            });
          });
        }, i * 500)

      }

      if (errors.length > 0) {
        reject(errors[0])
      } else {
        resolve('done')
      }

    });
  }


};

