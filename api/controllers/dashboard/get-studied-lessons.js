/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'History',


  description: 'History dashboard.',


  inputs: {
    limit: {
      type: 'number',
      isInteger: true
    }

  },


  exits: {
    success: {
      description: 'Lesson History Sent'
    },
    invalid: {
      responseType: 'badRequest',
      description: 'Invalid Request'
    }

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let count = await UserContents.count({
        user_id: inputs.userId,
        studied: 1,
        lesson_type: 0
      });

    let userLessons = await UserContents.find({
      where: {
        user_id: inputs.userId,
        studied: 1,
        lesson_type: 0
      },
      select: ['lesson', 'saved', 'studied', 'updatedAt'],  //  'title', 'slug', 'image', 'hash_code', 'publication_timestamp'
      sort: 'updatedAt DESC',
      limit: inputs.limit ? inputs.limit : 10,
    })
      // .sort('updatedAt DESC')
      .populate('lesson');

    let returnData = [];
    userLessons.forEach((item) => {
      item.lesson.saved =  item.saved;
      item.lesson.studied =  item.studied;
      returnData.push(item.lesson);
    });

    return {count: count, lessons: returnData}
    
  }

};
