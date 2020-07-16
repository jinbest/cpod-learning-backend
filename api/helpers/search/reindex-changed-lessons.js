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

    let records = await LessonData.find({
      where: {
        status_published: 'publish',
        is_private: 0,
        publication_timestamp: {
          '<': new Date()
        },
        updatedAt: {
          '>': new Date(Date.now() - 1000 * 60 * 60 * 24)
        }
      },
      sort: 'publication_timestamp DESC'
    });

    sails.log.info('Records Pooled');

    let commands = [];

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

      commands.push({
        index: {
          _index: index.elasticIndex,
          _type: index.elasticIndex,
          _id: indexRecord['id']
        }
      });
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
