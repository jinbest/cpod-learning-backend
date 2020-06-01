module.exports = {


  friendlyName: 'Get sitemap',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    return await LessonData.find({
      publication_timestamp: {
        '<': new Date()
      },
      status_published: 'publish',
      is_private: 0
    }).select('slug').sort('publication_timestamp DESC')

  }


};
