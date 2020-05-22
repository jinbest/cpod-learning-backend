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

      await sails.hooks.elastic.client.indices.delete({index: index.elasticIndex}, (error, response) => {
        if (error) {
          sails.log.error(error);
        }
      });

      sails.log.info('Index Deleted');


      let records = await CourseDetail.find({
        where: {
          publish_time: {
            '<': new Date()
          },
          is_private: 0
        }
      });

      sails.log.info(JSON.stringify(records.map(course => course.course_title)))

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

        action['_id'] = indexRecord['id'];

        commands.push(action);
        commands.push(indexRecord);
      });

      sails.log.info('Records Prepared');

      // run bulk command
      await sails.hooks.elastic.client.bulk({refresh: 'true', body: commands})
        .catch(error => sails.hooks.bugsnag.notify(error));

      sails.log.info('Records Pushed');

  }
};
