module.exports = {


  friendlyName: 'Get sitemap',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    let lessonData = await LessonData.find({
      publication_timestamp: {
        '<': new Date()
      },
      status_published: 'publish',
      is_private: 0
    }).select('slug').sort('publication_timestamp DESC');

    lessonData.forEach(lesson => {
      lesson.slug = decodeURI(lesson.slug)
    })

    return lessonData
  }


};
