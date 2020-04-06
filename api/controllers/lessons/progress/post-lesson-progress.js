module.exports = {


  friendlyName: 'Post lesson progress',


  description: '',


  inputs: {
    userId: {
      type: 'number',
      isInteger: true
    },
    lessonId: {
      type: 'string',
      required: true
    },
    track: {
      type: 'string',
      required: true
    },
    progress: {
      type: 'number',
      isInteger: true,
      required: true
    },
    source: {
      type: 'string',
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    if (!inputs.userId) {
      inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;
    }

    if (!inputs.source) {
      inputs.source = 'www.chinesepod.com'
    }

    if (sails.config.environment !== 'development') {

      userInfoQueue.add('LogProgress', inputs);

    } else {

      await sails.helpers.lessons.logProgress.with({userId: inputs.userId, lessonId: inputs.lessonId, track: inputs.track, progress: inputs.progress, source: inputs.source});

    }

  }


};
