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

    return await UserContents.find({
      where: {
        user_id: userId,
        studied: 1
      },
      select: ['lesson', 'saved', 'studied'],  //  'title', 'slug', 'image', 'hash_code', 'publication_timestamp'
      sort: 'updatedAt DESC',
      limit: inputs.limit ? inputs.limit : 10,
    })
      .populate('lesson')

    // return await LessonData.find()
    //   .populate('userContents', {
    //     where: {
    //       user_id: userId,
    //       studied: 1
    //     }})

  }


};
