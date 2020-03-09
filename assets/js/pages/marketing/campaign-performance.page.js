parasails.registerPage('campaign-performance', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    formData: {

    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    $(".flatpickr").flatpickr({
      defaultDate: [new Date(this.formData.fromDate), new Date(this.formData['toDate'])],
      wrap: true,
      mode: "range",
      maxDate: new Date(),
      onChange: (selectedDates, dateStr, instance) => {
        console.log({selectedDates: selectedDates, dateStr: dateStr, instance: instance});
        this.formData.fromDate = selectedDates[0];
        this.formData.toDate = selectedDates[1];
        console.log(this.formData);
      },
    });

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    startSearch(){
      if (this.formData.fromDate && this.formData.toDate){
        window.location.search = `?fromDate=${this.formData.fromDate.toISOString()}&toDate=${this.formData.toDate.toISOString()}`
      } else {
        alert('Invalid Date Range')
      }
    }
  }
});
