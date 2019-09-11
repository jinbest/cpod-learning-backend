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
    const sanitizeHtml = require('sanitize-html');

    if (!inputs.slug && !inputs.lessonId) {
      throw 'invalid'
    }

    sails.log.info(inputs);

    let lessonData = {};

    if (inputs.slug) {
      sails.log.info('DB Lookup');
      lessonData = await LessonData.findOne({slug: encodeURI(inputs.slug)})
    } else {
      lessonData = await LessonData.findOne({id: inputs.lessonId})
    }

    sails.log.info(lessonData);

    if (lessonData.slug) {
      let lesson =  _.pick(lessonData, ['id', 'title', 'introduction','hash_code', 'image', 'type', 'level', 'hosts' ,
        'publication_timestamp','saved', 'studied', 'video', 'mp3_dialogue', 'mp3_public',
        'mp3_private', 'mp3_thefix', 'pdf1', 'pdf2', 'mp3_public_size', 'mp3_private_size', 'mp3_thefix_size']);
      lesson.introduction = sanitizeHtml(lesson.introduction, {
        allowedTags: [],
        allowedAttributes: {}
      });
      return lesson
    } else {
      throw 'invalid'
    }
  }


};
