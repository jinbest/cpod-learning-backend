module.exports = {


  friendlyName: 'Reindex',


  description: 'Reindex search.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let index = {
      model: 'CourseDetails',
      elasticModel: 'CourseIndex',
      elasticIndex: 'courses',
      elasticRecord: [
        'id',
        'course_title',
        'course_introduction',
        'channel_id',
        'type',
        'publish_time',
        'createdAt',
        'updatedAt'
      ],
      idColumn: 'id'
    };

    let records = await CourseDetail.find({
      where: {
        publish_time: {
          '<': new Date()
        },
        is_private: 0,
        updatedAt: {
          '>': new Date(Date.now() - 1000 * 60 * 60 * 24)
        }
      }
    });

    sails.log.info('Records Pooled');

    let commands = [];

    records.forEach(record => {
      let action = {
        index: {
          _index: index.elasticIndex,
          _type: index.elasticIndex,
        }
      };

      let indexRecord = {};
      index.elasticRecord.forEach(key => {
        indexRecord[key] = record[key];
      });

      action['index']['_id'] = indexRecord['id'];

      commands.push(action);
      commands.push(indexRecord);
    });

    sails.log.info('Records Prepared');

    sails.log.info(commands)

    // run bulk command
    await sails.hooks.elastic.client.bulk({refresh: 'true', body: commands})
      .catch(error => sails.hooks.bugsnag.notify(error));

    sails.log.info('Records Pushed');

  }
};
