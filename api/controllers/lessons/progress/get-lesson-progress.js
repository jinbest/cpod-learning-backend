module.exports = {


  friendlyName: 'Get progress',


  description: '',


  inputs: {
    lessonId: {
      type: 'string'
    },
    track: {
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let currentProgress = [];

    if (!inputs.track) {

      currentProgress = await LessonProgress.find({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.track});

      currentProgress.forEach(item => item.progress = parseInt(item.progress * 100))

      return currentProgress

    } else {

      currentProgress = await LessonProgress.findOne({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.track});

      if (!currentProgress) {
        return {}
      } else {
        currentProgress.progress = parseInt(currentProgress.progress * 100);

        return currentProgress
      }
    }



  }


};
