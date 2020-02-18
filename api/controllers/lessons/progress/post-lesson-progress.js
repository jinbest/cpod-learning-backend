module.exports = {


  friendlyName: 'Post lesson progress',


  description: '',


  inputs: {
    userId: {
      type: 'number',
      isInteger: true
    },
    lessonId: {
      type: 'string'
    },
    track: {
      type: 'string'
    },
    progress: {
      type: 'number',
      isInteger: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    if (!inputs.userId) {
      inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;
    }

    sails.log.info(inputs);

    let progress = await LessonProgress.find({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.track});

    let currentProgress = progress[0];

    if (progress.length > 1) {

      await LessonProgress.destroy({id: progress.slice(1).map(item => item.id)});

    }

    if (!currentProgress) {

      return await LessonProgress.create({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.track, progress: inputs.progress / 100})

    } else if (inputs.progress > currentProgress.progress * 100){

      return await LessonProgress.updateOne({id: currentProgress.id}).set({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.track, progress: inputs.progress / 100})

    }

  }


};
