parasails.registerPage('level', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    level: '',
    charSet: '',
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
    setLevel (level) {
      this.level = level;
      this.flipPage();
      this.postData();
    },
    setCharSet (charSet) {
      this.syncing = true;
      this.charSet = charSet;
      this.postData();
      window.location = '/home';
    },
    skip () {
      this.syncing = true;
      this.postData();
      window.location = '/home';
    },
    flipPage() {
      this.nextPage = !this.nextPage;
      window.scrollTo(0,0);
    },
    postData: async function () {
      if (!this.level) {
        this.level = 'Newbie'
      }
      if (!this.charSet) {
        this.charSet = 'simplified'
      }
      await Cloud[this.pageName].with({
        level: this.level,
        charSet: this.charSet
      })
    },
    placementTest() {
      window.location = '/placement';
    }
  }

});
