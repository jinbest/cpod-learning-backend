parasails.registerPage('secret-page', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    topLesson: '',
    topLessonTitle: '',
    topLessonUsers: [],
    otherTopLessons: [],
    lessonViews: [],
    syncing: true,
    error: '',
    days: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    await Cloud['getPopularLessons'].with({
      days: this.days
    })
      .then((data) => {
        this.topLesson = data.topLesson;
        this.topLessonUsers = data.topLessonUsers;
        this.otherTopLessons = data.otherTopLessons;
        this.lessonViews = data.lessonViews;
        this.days = data.period;
        this.syncing = false
      })
      .catch((e) => {
        this.error = e;
        console.log(e);
        this.syncing = false;
      });
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
  }
});
