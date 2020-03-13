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
    //
    let offsetUS = - 4 * 60;
    //
    // let offsetServer = sails.config.environment === 'development' ? new Date().getTimezoneOffset() : 0;

    let fromTime = new Date(time);
    fromTime.setMinutes(time.getMinutes() + offsetUS - 60);
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

    console.log({org: time.getTime(), from: fromTime, to: toTime, offset: offsetUS});

    console.log(lessons);

    let targetLesson = lessons[0];

    if(targetLesson && targetLesson.title && targetLesson.slug && targetLesson.level) {
      sails.hooks.bugsnag.notify(`Lesson Alert - ${lessons[0].title}`);
      sails.hooks.bugsnag.notify(JSON.stringify({title: lessons[0].title, slug: lessons[0].slug, level: lessons[0].level.toUpperCase()}));
      // sails.sockets.blast('NEW_LESSON', {title: lessons[0].title, slug: lessons[0].slug, level: lessons[0].level.toUpperCase()});

    }
  }


};

