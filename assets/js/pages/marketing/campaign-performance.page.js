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
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr, instance) => {
        let from = new Date(selectedDates[0]);
        let to = new Date(selectedDates.slice(-1)[0]);
        this.formData.fromDate = new Date(`${from.getFullYear()}-${("0" + (from.getMonth() + 1)).slice(-2)}-${("0" + from.getDate()).slice(-2)} UTC`);
        this.formData.toDate =  new Date(`${to.getFullYear()}-${("0" + (to.getMonth() + 1)).slice(-2)}-${("0" + to.getDate()).slice(-2)} 23:59:59 UTC`);
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
        this.formData.fromDate = new Date(this.formData.fromDate).toISOString();
        this.formData.toDate = new Date(this.formData.toDate).toISOString();
        console.log(`?fromDate=${this.formData.fromDate}&toDate=${this.formData.toDate}`);
        window.location.search = `?fromDate=${this.formData.fromDate}&toDate=${this.formData.toDate}`
      } else {
        alert('Invalid Date Range')
      }
    }
  }
});
