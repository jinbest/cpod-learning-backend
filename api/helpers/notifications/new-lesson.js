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

    let lessons = await LessonData.find({publication_timestamp: {
      '>=': new Date(Date.now() - 10 * 60 * 1000),
      '<': new Date()
    }});

    sails.hooks.bugsnag.notify(`Lesson Alert - ${lessons[0].title}`);
    let targetLesson = lessons[0];

    if(targetLesson.title && targetLesson.slug && targetLesson.level) {

      sails.hooks.bugsnag.notify(JSON.stringify({title: lessons[0].title, slug: lessons[0].slug, level: lessons[0].level.toUpperCase()}));
å
      // sails.sockets.blast('NEW_LESSON', {title: lessons[0].title, slug: lessons[0].slug, level: lessons[0].level.toUpperCase()});

    }
  }


};

