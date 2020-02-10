parasails.registerPage('paypal-pay', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: {
      currency: 'USD'
    },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // A set of validation rules for our form.
    // > The form will not be submitted if these are invalid.
    formRules: {
      amount: { required: true },
    },

    // Server error state for the form
    cloudError: '',

    success: false
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {

    let  client = {
      sandbox: 'AZGCQyxdYVNlEao8bzD7tMrccqocSl4hjZmhR6nZ8bL7rCewPXRywjP-uwolycnyIodbL5oQvN8dixZE',
      production: 'AWZiTif-WpZUU8mjN2PbrRy_fTYDj2-_VqswzgiEUepQZc7g-jFJFaB4OjnSeU00UQtsReGPMo_tQ7yu'
    };

    let  payment = (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            {
              amount: { total: this.formData.amount, currency: this.formData.currency }
            }
          ]
        }
      });
    };

    let onAuthorize = (data) => {
      this.syncing = true;

      console.log(data);

      var data = {
        paymentID: data.paymentID,
        payerID: data.payerID,
        amount: this.formData.amount,
        currency: this.formData.currency
      };
      this.sendDataPaypal({data:data}).then(() => {

        this.success = true // to display the success message

      }).catch(err => {

        this.formErrors.paypal = true  // to display  the error message

      });
    };

    paypal.Button.render({
      env: 'sandbox', // sandbox | production
      commit: true,
      style: {
        size: 'responsive',
        color: 'gold',
        shape: 'rect',
        label: 'pay',
        tagline: 'false'
      },
      client,
      payment,
      onAuthorize
    }, '#paypal-button-container');
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function() {
      // Redirect to the logged-in dashboard on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;
    },
    async sendDataPaypal (data) {
      await Cloud['paypalExecute'].with(data)
        .then(res => {
          if (res.success) {
            this.syncing = false;
            this.success = true;
            // setTimeout(() => {
            //   window.location.href = '/checkout/paypal-success'
            // }, 10000)
          } else {
            this.syncing = false;
            this.error = true
          }
        })
        .catch(() => {
          this.syncing = false;
          this.error = true
        })
    }
  }
});
