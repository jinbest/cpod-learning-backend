module.exports = {


  friendlyName: 'New lesson',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    let time = new Date();
    let offsetUS = - 4 * 60;

    let fromTime = new Date(time);
    fromTime.setMinutes(time.getMinutes() + offsetUS - 15);
    fromTime.setSeconds(0);

    let toTime = new Date(time);
    toTime.setMinutes(time.getMinutes() + offsetUS);
    toTime.setSeconds(0);

    let lessons = await LessonData.find({
      publication_timestamp: {
      '>=': fromTime,
      '<': toTime
      },
      status_published: 'publish'
    });

    let targetLesson = lessons[0];

    if(targetLesson && targetLesson.title && targetLesson.slug && targetLesson.level) {
      sails.sockets.blast('NEW_LESSON', {title: targetLesson.title, slug: targetLesson.slug, level: targetLesson.level.toUpperCase()});
      for (const lesson of lessons) {
        await sails.helpers.search.indexLesson(lesson.id)
      }
    }
  }


};

