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
        'course_title',
        'course_introduction',
        'channel_id',
        'type'
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

      let records = await Vocabulary.find({
        where: {
          publish_time: {
            '<': new Date()
          },
          is_private: 0
        }
      });

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

