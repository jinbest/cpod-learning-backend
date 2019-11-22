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
          'publication_timestamp'
        ],
        // populate: 'members',
        idColumn: 'id'
      };

    await new Promise(async (resolve, reject) => {
      let records = await LessonData.find({where: {
          status_published: 'publish',
          publication_timestamp: {
            '<': new Date()
          }
        }
      });
      let commands = [];
      let action = {
        index: {
          _index: index.elasticIndex,
          _type: index.elasticIndex
        }
      };

      sails.log.info(records);

      records.forEach(record => {
        let indexRecord = {};
        index.elasticRecord.forEach(key => {
          indexRecord[key] = record[key];
        });

        commands.push(action);
        commands.push(indexRecord);
      });

      sails.log.info(commands);

      // run bulk command
      sails.hooks.elastic.client.bulk({body: commands}, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
};
