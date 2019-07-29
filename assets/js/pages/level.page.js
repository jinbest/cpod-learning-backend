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
      this.charSet = charSet;
      console.log(charSet);
      this.postData();
      // window.location = '/dashboard/free';
    },
    skip () {
      this.postData();
      window.location = '/dashboard/free';
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
        this.charSet = 'simplified';
        console.log('rewrite to simplified')
      }
      let response = await Cloud[this.pageName].with({
        level: this.level,
        charSet: this.charSet
      });
      console.log(response);
    },
    placementTest() {
      window.location = '/placement';
    }
  }

});
