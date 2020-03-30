module.exports = {


  friendlyName: 'Reindex',


  description: 'Reindex search.',


  inputs: {

    lessonId: {
      type: 'string'
    }

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

      let records = await LessonData.find({
        where: {
          id: inputs.lessonId,
          status_published: 'publish',
          is_private: 0
        },
        sort: 'publication_timestamp DESC'
      });


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
