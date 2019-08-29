module.exports = {


  friendlyName: 'Get lesson',


  description: '',


  inputs: {
    slug: {
      type: 'string',
      description: 'Designated Lesson Slug',
    },
    lessonId: {
      type: 'string',
      description: 'Designated Lesson ID'
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {
    if (!inputs.slug && !inputs.lessonId) {
      throw 'invalid'
    }

    sails.log.info(inputs);

    let lessonData = {};

    if (inputs.slug) {
      lessonData = await LessonData.findOne({slug: inputs.slug})
    } else {
      lessonData = await LessonData.findOne({id: inputs.lessonId})
    }

    if (lessonData.slug) {
      return lessonData
    } else {
      throw 'invalid'
    }
  }


};
