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

      // await sails.hooks.elastic.client.indices.create({
      //   index: index.elasticIndex,
      //   body: {
      //     settings: {
      //       analysis: {
      //         analyzer: {
      //           lesson_analyzer: {
      //             type: 'snowball'
      //           }
      //         }
      //       }
      //     },
      //     mapping: {
      //       lesson: {
      //         _all: {enabled : true, analyzer: "lesson_analyzer", search_analyzer: "lesson_analyzer"},
      //         properties: {
      //           id: {
      //             type: 'number',
      //             index: 'not_analyzed'
      //           },
      //           status_published: {
      //             type: 'text',
      //             index: 'not_analyzed'
      //           },
      //           slug: {
      //             type: 'text',
      //             index: 'not_analyzed'
      //           },
      //           publication_timestamp: {
      //             type: 'text',
      //             index: 'not_analyzed'
      //           },
      //           level: {
      //             type: 'text',
      //             index: 'not_analyzed'
      //           },
      //           hash_code: {
      //             type: 'text',
      //             index: 'not_analyzed'
      //           },
      //           image: {
      //             type: 'text',
      //             index: 'not_analyzed'
      //           },
      //           type: {
      //             type: 'text',
      //             index: 'not_analyzed'
      //           },
      //           title: {
      //             type: 'string',
      //             index: 'analyzed',
      //             analyzer: 'lesson_analyzer',
      //             search_analyzer: 'lesson_analyzer',
      //           },
      //           introduction: {
      //             type: 'string',
      //             index: 'analyzed',
      //             analyzer: 'lesson_analyzer',
      //             search_analyzer: 'lesson_analyzer',
      //           },
      //           hosts: {
      //             type: 'string',
      //             index: 'analyzed',
      //             analyzer: 'lesson_analyzer',
      //             search_analyzer: 'lesson_analyzer',
      //           },
      //           transcription1: {
      //             type: 'text',
      //             index: 'not_analyzed'
      //           },
      //         }
      //       }
      //     }
      //   }
      // }, () => {});


      let records = await LessonData.find({
        where: {
          status_published: 'publish',
          publication_timestamp: {
            '<': new Date()
          }
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

      // sails.hooks.elastic.client.indices.analyze({
      //   index: index.elasticIndex,
      //   body:
      // })

    });
  }
};
