parasails.registerPage('livestream', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    streams: [],
    modal: '',
    formData: {
    },
    formErrors: {},
    syncing: false,
    loading: false,


    cloudError: false,
    cloudSuccess: false,

    startTime: '',
    promotionFrom: ''

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: function() {
    this.streams.forEach(stream => {
      // stream.startTimeShow = stream.startTime;
      // stream.startTime = stream.startTime.slice(0,-5);
      // if (stream.promotionFrom) {
      //   stream.promotionFromShow = stream.promotionFrom
      //   stream.promotionFrom = stream.promotionFrom.slice(0,-5);
      // }
    })
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    updateStreams() {
      console.log('success');
      location.reload();
    },
    async deleteStream(id) {
      this.syncing = true;
      await Cloud['deleteLivestreamData'].with({
        livestreamId: id
      });
      this.updateStreams();
    },
    createStream() {
      this.modal = 'editStream'
    },
    editStream(stream) {
      this.formData = stream;
      this.modal = 'editStream'
    },
    async saveStream() {
      await Cloud['saveLivestreamData'].with(this.formData);
      this.updateStreams();
    },
    updateStartTime () {
      this.formData.startTime = new Date(`${this.formData.startYear}-${this.formData.startMonth}-${this.formData.startDay}
      ${this.formData.startHour}:${this.formData.startMinute} EST`);
      console.log(this.formData.startTime)
    },
    updatePromotionTime () {
      this.formData.promoteFrom = new Date(`${this.formData.promotionYear}-${this.formData.promotionMonth}-${this.formData.promotionDay}
      ${this.formData.promotionHour}:${this.formData.promotionMinute} EST`);
      console.log(this.formData.promoteFrom)
    }
  }
});
