/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'All lessons',


  description: '',


  inputs: {
    limit: {
      type: 'number',
      isInteger: true
    },
    skip: {
      type: 'number',
      isInteger: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let count = await LessonData.count({
        publication_timestamp: {
          '<=': new Date()
        },
        status_published: 'publish'
      });

    let rawData = await LessonData.find({
      where: {
        publication_timestamp: {
          '<=': new Date()
        },
        status_published: 'publish'
      },
      sort: 'publication_timestamp DESC',
      skip: inputs.skip ? inputs.skip : 0,
      limit: inputs.limit ? inputs.limit : 10
    }).populate('userContents', {
      where: {user_id: inputs.userId, lesson_type: 0}
    });

    let cleanData = [];
    rawData.forEach((lesson) => {
      if (lesson.userContents[0]){
        lesson.saved = lesson.userContents[0].saved ? lesson.userContents[0].saved : 0;
        lesson.studied = lesson.userContents[0].studied ? lesson.userContents[0].studied : 0;
        delete lesson.userContents;
        cleanData.push(lesson)
      } else {
        delete lesson.userContents;
        cleanData.push(lesson)
      }
    });
    return {count: count, lessons: cleanData}
  }

  };
