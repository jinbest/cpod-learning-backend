module.exports = {


  friendlyName: 'Post progress',


  description: '',


  inputs: {
    userId: {
      type: 'number'
    },
    lessonId: {
      type: 'string'
    },
    track: {
      type: 'string'
    },
    progress: {
      type: 'number'
    },
    source: {
      type: 'string',
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    let progress = await LessonProgress.find({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.track});

    let currentProgress = progress[0];

    if (progress.length > 1) {

      await LessonProgress.destroy({id: progress.slice(1).map(item => item.id)});

    }

    if (!currentProgress) {

      return await LessonProgress.create({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.track, progress: inputs.progress / 100, source: inputs.source})

    } else if (inputs.progress > currentProgress.progress * 100){

      return await LessonProgress.updateOne({id: currentProgress.id}).set({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.track, progress: inputs.progress / 100})

    }


  }


};

