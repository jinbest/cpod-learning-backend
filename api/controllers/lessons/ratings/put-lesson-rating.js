module.exports = {


  friendlyName: 'Put lesson rating',


  description: '',


  inputs: {
    slug: {
      type: 'string',
      required: true
    },
    rating: {
      type: 'number',
      required: true
    },
    teachingNotification: {
      type: 'boolean'
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let lessonData = await LessonData.findOne({slug: inputs.slug})

    if(!lessonData) {
      throw 'invalid'
    }

    return await ContentRates.updateOrCreate(
      {user_id: inputs.userId, lessonId: lessonData.id},
      {user_id: inputs.userId, lessonId: lessonData.id, rate: inputs.rating})

  }


};
