module.exports = {


  friendlyName: 'Bookmarks',


  description: 'Bookmarks dashboard.',


  inputs: {
    limit: {
      type: 'number',
      isInteger: true
    }

  },

  exits: {
    success: {
      description: 'Bookmarked Lessons Sent'
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
        saved: 1,
        lesson_type: 0
      },
      select: ['lesson', 'saved', 'studied', 'updatedAt'],  //  'title', 'slug', 'image', 'hash_code', 'publication_timestamp'
      sort: 'updatedAt DESC',
      limit: inputs.limit ? inputs.limit : 10,
    })
      .populate('lesson');

    let returnData = [];
    userLessons.forEach((item) => {
      item.lesson.saved =  item.saved;
      item.lesson.studied =  item.studied;
      returnData.push(item.lesson);
    });
    return returnData

  }

};
