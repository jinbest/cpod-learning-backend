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
          'levelId',
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
          is_private: 0,
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


      const levelIds = {
        newbie: 1,
        elementary: 2,
        'pre intermediate': 3,
        intermediate: 4,
        'upper intermediate': 5,
        advanced: 6,
        media: 7,
        any: 0
      };


      records.forEach(record => {
        let indexRecord = {};
        index.elasticRecord.forEach(key => {
          indexRecord[key] = record[key];
        });

        indexRecord['levelId'] = levelIds[indexRecord['level'].toLowerCase()];

        commands.push(action);
        commands.push(indexRecord);
      });

      sails.log.info('Records Prepared');

      // run bulk command
      await sails.hooks.elastic.client.bulk({body: commands}, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });


    });
  }
};
