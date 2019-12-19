parasails.registerPage('level', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    level: '',
    charSet: 'simplified',
    nextPage: false,
    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    async setLevel (level) {
      this.level = level;
      this.flipPage();
      await Cloud[this.pageName].with({
        level: this.level
      })
    },
    async setCharSet (charSet) {
      this.syncing = true;
      this.charSet = charSet;
      await Cloud[this.pageName].with({
        charSet: this.charSet
      });
      window.location = '/home';
    },
    async skip () {
      this.syncing = true;
      await Cloud[this.pageName].with({
        charSet: this.charSet
      });
      window.location = '/home';
    },
    flipPage() {
      this.nextPage = !this.nextPage;
      window.scrollTo(0,0);
    },
    postData: async function () {
      // if (this.level && this.charSet) {
      //   await Cloud[this.pageName].with({
      //     level: this.level,
      //     charSet: this.charSet
      //   })
      // } else if (this.charSet) {
      //
      // } else if (this.level) {
      //   await Cloud[this.pageName].with({
      //     level: this.level
      //   })
      // }
    },
    placementTest() {
      window.location = '/placement';
    }
  }

});
