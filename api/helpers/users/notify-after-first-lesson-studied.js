module.exports = {


  friendlyName: 'Notify after first lesson studied',


  description: '',


  inputs: {

    userId: {
      type: 'number',
      isInteger: true,
      required: true
    },
    lessonId: {
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    const axios = require('axios')

    await axios.post('https://email-api.chinesepod.com/api/v1/email/trigger', {
      data: {
        userId: inputs.userId,
        lessonId: inputs.lessonId,
      },
      trigger: 'first-lesson-studied'
    })
      .catch(e => sails.hooks.bugsnag.notify(e))
  }
};

