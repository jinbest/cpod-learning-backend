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
    },
    comments: {
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

    const sanitizeHtml = require('sanitize-html');

    const sanitizeOptions = {
      allowedTags: [],
      allowedAttributes: {}
    };

    if (!inputs.slug && !inputs.lessonId) {
      throw 'invalid'
    }

    sails.log.info(inputs);

    let lessonData = {};

    if (inputs.slug) {
      if (inputs.comments) {
        lessonData = await LessonData.findOne({slug: encodeURI(inputs.slug)})
          .populate('comments', {where: {type: 'lesson'}})
      } else {
        lessonData = await LessonData.findOne({slug: encodeURI(inputs.slug)})
      }
    } else {
      lessonData = await LessonData.findOne({id: inputs.lessonId})
        .populate('comments', {where: {type: 'lesson'}})
    }

    sails.log.info(lessonData);

    if (lessonData && lessonData.slug) {
      let lesson = lessonData;
      lesson.introduction = sanitizeHtml(lesson.introduction, sanitizeOptions);

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

      if (userLessons[0]) {
        lesson.studied = userLessons[0].studied ? userLessons[0].studied : false;
        lesson.saved = userLessons[0].saved ? userLessons[0].saved : false;
      }

      // if (lesson.comments && lesson.comments.length > 0) {
      //   _.each(lesson.comments, function (comment) {
      //     sanitizeHtml(comment, sanitizeOptions)
      //   })
      // }

      return lesson

    } else {
      throw 'invalid'
    }
  }


};