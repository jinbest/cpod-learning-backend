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
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {

    if (!inputs.userId) {
      inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session && this.req.session.userId ? this.req.session.userId : '';
    }

    if (!inputs.userId) {
      throw 'invalid'
    }

    if (!inputs.source) {
      inputs.source = 'www.chinesepod.com'
    }

    if (sails.config.environment !== 'production' || sails.config.environment === 'staging') {
      // await sails.helpers.lessons.logProgress.with({userId: inputs.userId, lessonId: inputs.lessonId, track: inputs.track, progress: inputs.progress, source: inputs.source});

      return

    } else {

      userInfoQueue.add(
        'LogProgress',
        inputs,
        {
          attempts: 3,
          timeout: 60000
      });

    }

  }


};
