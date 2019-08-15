module.exports = {


  friendlyName: 'All lessons',


  description: '',


  inputs: {
    limit: {
      type: 'number',
      isInteger: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {
    let userId = 1016995;

    return await LessonData.find({
      where: {
        publication_timestamp: {
          '<=': new Date()
        },
        status_published: 'published'
      },
      sort: 'publication_timestamp DESC',
      limit: inputs.limit ? inputs.limit : 10
    }).populate('userContents', {
      where: {user_id: userId}
    })
  }

};
