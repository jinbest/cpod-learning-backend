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

    const cleanLink = (link) => {
      if (!link) {
        return ''
      }
      link = link.replace('http:', 'https:');
      link = link.replace('https://s3.amazonaws.com/chinesepod.com/', 'https://s3contents.chinesepod.com/');
      return link
    }

    const sanitizeOptions = {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'image'],
      allowedAttributes: {
        a: [ 'href', 'name', 'target'],
        image: ['src', 'alt', 'width', 'height'],
      }
    };

    if (!inputs.slug && !inputs.lessonId) {
      throw 'invalid'
    }

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
      } else {
        lesson.studied = false;
        lesson.saved = false;
      }

      let lessonRoot = `https://s3contents.chinesepod.com/${lessonData.type === 'extra' ? 'extra/' : ''}${lessonData.id}/${lessonData.hash_code}/`
      if (lessonData.image) {
        lessonData.image = cleanLink(
          lessonData.image && lessonData.image.startsWith('http')
            ? lessonData.image
            : lessonRoot + lessonData.image
        );
      }
      if (lessonData.mp3_dialogue) {
        lessonData.mp3_dialogue = cleanLink(
          lessonData.mp3_dialogue && lessonData.mp3_dialogue.startsWith('http')
            ? lessonData.mp3_dialogue
            : lessonRoot + lessonData.mp3_dialogue
        );
      }
      if (lessonData.mp3_public) {
        lessonData.mp3_public = cleanLink(
          lessonData.mp3_public && lessonData.mp3_public.startsWith('http')
            ? lessonData.mp3_public
            : lessonRoot + lessonData.mp3_public
        );
      }
      if (lessonData.mp3_private) {
        lessonData.mp3_private = cleanLink(
          lessonData.mp3_private && lessonData.mp3_private.startsWith('http')
            ? lessonData.mp3_private
            : lessonRoot + lessonData.mp3_private
        );
      }
      if (lessonData.mp3_thefix) {
        lessonData.mp3_thefix = cleanLink(
          lessonData.mp3_thefix && lessonData.mp3_thefix.startsWith('http')
            ? lessonData.mp3_thefix
            : lessonRoot + lessonData.mp3_thefix
        );
      }
      if (lessonData.pdf1) {
        lessonData.pdf1 = cleanLink(
          lessonData.pdf1 && lessonData.pdf1.startsWith('http')
            ? lessonData.pdf1
            : lessonRoot + lessonData.pdf1
        );
      }
      if (lessonData.pdf2) {
        lessonData.pdf2 = cleanLink(
          lessonData.pdf2 && lessonData.pdf2.startsWith('http')
            ? lessonData.pdf2
            : lessonRoot + lessonData.pdf2
        );
      }

      lesson.extra = lesson.type === 'extra'

      return lesson
    } else {
      throw 'invalid'
    }
  }


};
