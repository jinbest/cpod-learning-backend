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

    return await UserContents.find({
      where: {
        user_id: userId,
        saved: 1
      },
      select: ['lesson', 'saved', 'studied'],  //  'title', 'slug', 'image', 'hash_code', 'publication_timestamp'
      sort: 'updatedAt DESC',
      limit: inputs.limit ? inputs.limit : 10,
    })
      .populate('lesson')
  }


};
