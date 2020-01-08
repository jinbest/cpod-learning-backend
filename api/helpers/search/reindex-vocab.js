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
      model: 'Vocabulary',
      elasticModel: 'VocabularyIndex',
      elasticIndex: 'vocabulary',
      elasticRecord: [
        'id',
        'vocabulary_class',
        'column_1', // Simplified
        'column_2', // Pinyin
        'column_3', // English
        'column_4', // Traditional
        'audio',
        'v3_id'
      ],
      idColumn: 'id'
    };

    await new Promise(async (resolve, reject) => {

      await sails.hooks.elastic.client.indices.delete({index: index.elasticIndex}, (error, response) => {
        if (error) {
          sails.log.error(error);
        }
      });

      sails.log.info('Index Deleted');

      const groupBy = key => array =>
        array.reduce((objectsByKeyValue, obj) => {
          const value = obj[key];
          objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
          return objectsByKeyValue;
        }, {});

      let vocabulary = await Vocabulary.find({
        where: {
          vocabulary_class: {
            in: ['Key Vocabulary', 'Supplementary', 'Expansion']
          }
        }
      });

      const groupBySimpChinese = groupBy('column_1');

      let groupedVocab = groupBySimpChinese(vocabulary);



      let records = [];

      sails.log.info('Records Pooled');

      let commands = [];
      let action = {
        index: {
          _index: index.elasticIndex,
          _type: index.elasticIndex
        }
      };

      records.forEach(record => {
        let indexRecord = {};
        index.elasticRecord.forEach(key => {
          indexRecord[key] = record[key];
        });

        commands.push(action);
        commands.push(indexRecord);
      });

      sails.log.info('Records Prepared');

      // run bulk command
      await sails.hooks.elastic.client.bulk({refresh: 'true', body: commands}, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });

    });
  }


};

