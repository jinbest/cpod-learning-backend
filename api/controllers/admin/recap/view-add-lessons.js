module.exports = {


  friendlyName: 'View add lessons',


  description: 'Display "Add lessons" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/recap/add-lessons'
    }

  },


  fn: async function () {

    let currentLessons = await ContentsRecapReady.find().select('lessonId');

    // Respond with view.
    return {
      currentWhitelist: currentLessons.map(lesson => lesson.lessonId).join(', ')
    };

  }


};
