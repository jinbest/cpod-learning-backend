module.exports = {


  friendlyName: 'Post lesson progress',


  description: '',


  inputs: {
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
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let currentProgress = await LessonProgress.findOne({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.type});

    if (!currentProgress) {

      return await LessonProgress.create({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.type, progress: inputs.progress}).fetch()

    } else if (inputs.progress > currentProgress.progress * 100){

      return await LessonProgress.updateOne({id: currentProgress.id}).set({userId: inputs.userId, lessonId: inputs.lessonId, track_type: inputs.type, progress: inputs.progress / 100})

    }

  }


};
