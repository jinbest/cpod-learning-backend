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

    let lessonData = await LessonData.findOne({
      id: inputs.lessonId,
      status_published: 'publish',
      is_private: 0
    });


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


    let indexRecord = {};
    index.elasticRecord.forEach(key => {
      indexRecord[key] = lessonData[key];
    });

    indexRecord['levelId'] = levelIds[indexRecord['level'].toLowerCase()];

    await sails.hooks.elastic.client.index({index: index.elasticIndex, id: indexRecord['id'], body: indexRecord})
      .catch(error => sails.hooks.bugsnag.notify(error));
    await sails.hooks.elastic.client.indices.refresh({index: index.elasticIndex})
      .catch(error => sails.hooks.bugsnag.notify(error))
  }
};
