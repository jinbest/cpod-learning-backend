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
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

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

      let userLessons = await UserContents.find({
        where: {
          lesson: lessonData.id,
          user_id: inputs.userId,
          lesson_type: 0
        },
        select: ['lesson', 'saved', 'studied', 'updatedAt'],  //  'title', 'slug', 'image', 'hash_code', 'publication_timestamp'
        sort: 'updatedAt DESC',
        limit: inputs.limit ? inputs.limit : 10,
      });
      console.log(userLessons);
      if (userLessons[0]) {
        lesson.studied = userLessons[0].studied ? userLessons[0].studied : false;
        lesson.saved = userLessons[0].saved ? userLessons[0].saved : false;
      }
      return lesson
    } else {
      throw 'invalid'
    }
  }


};
