module.exports = {


  friendlyName: 'Reindex',


  description: 'Reindex search.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let index = {
        model: 'LessonData',
        elasticModel: 'LessonDataIndex',
        elasticIndex: 'lessons',
        elasticRecord: [
          'id',
          'status_published',
          'slug',
          'title',
          'introduction',
          'type',
          'publication_timestamp',
          'level',
          'hosts',
          'hash_code',
          'image',
          'transcription1'
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


      let records = await LessonData.find({
        where: {
          status_published: 'publish',
          publication_timestamp: {
            '<': new Date()
          }
        },
        sort: 'publication_timestamp DESC'
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
