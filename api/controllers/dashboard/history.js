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
    let userId = '1016995';

    let userLessons = await UserContents.find({
      where: {
        user_id: userId,
        studied: 1
      },
      select: ['lesson', 'saved', 'studied', 'updatedAt'],  //  'title', 'slug', 'image', 'hash_code', 'publication_timestamp'
      sort: 'updatedAt DESC',
      limit: inputs.limit ? inputs.limit : 10,
    })
      // .sort('updatedAt DESC')
      .populate('lesson');

    let returnData = [];
    userLessons.forEach((item) => {
      item.lesson.userContents = [{
        saved: item.saved,
        studied: item.studied
      }];
      returnData.push(item.lesson);
    });
    return returnData
  }

};
