parasails.registerPage('checkout', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    showTrialBanner: true,
    trial: false,
    plan: 'premium',
    premium: true,
    billingCycle: 'monthly',
    paymentMethod: 'stripe',
    needsAccount: false,
    enablePaypal: false,
    pricing:{
      basic: {
        monthly: 14,
        quarterly: 39,
        annually: 124
      },
      premium: {
        monthly: 29,
        quarterly: 79,
        annually: 249
      }
    },
    formData: {
      fName: 'Ugis',
      lName: 'Rozkalns',
      emailAddress: 'ugis@chinesepod.com',
      password: '',
      promoCode: '',
      agreedToTerms: false,
      zip: ''
    },
    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

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
    // Create a Stripe client.
    const stripe = Stripe('pk_test_4VxncInS2mI0bVeyKWPOGSMY');
    this.stripe = stripe;

// Create an instance of Elements.
    const elements = stripe.elements();

    this.card = elements.create('card', {
      style: {
        base: {
          iconColor: '#F99A52',
          color: '#666',
          lineHeight: '33px',
          fontWeight: 400,
          fontFamily: '"Roboto", "Open Sans", "Helvetica Neue", "Helvetica", sans-serif',
          fontSize: '15px',


          '::placeholder': {
            color: '#7DB6D4',
          }
        },
      }
    });

// Add an instance of the card Element into the `card-element` <div>.
    this.card.mount('#card-element');
    // this.card.on('change', function (event) {
    //   console.
    // });
    this.card.on('focus', function (e) {
      $('#card-element').css('border', '1px solid #2487c1');
    });
    this.card.on('blur', function (e) {
      $('#card-element').css('border-color', '#e6e6e6');
    });
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function() {
      // If email confirmation is enabled, show the success message.
      this.cloudSuccess = true;
      console.log('Submitted');
    },
    handleParsingForm: async function() {
      // Clear out any pre-existing error messages.

      console.log('Handle Submit');

      this.formErrors = {};

      this.syncing = true;

      var argins = this.formData;
      // Validate email:
      if(!argins.emailAddress || !parasails.util.isValidEmailAddress(argins.emailAddress)) {
        this.formErrors.emailAddress = true;
        console.log(this.formErrors);
      }

      this.token = await this.stripe.createToken(this.card);

      if (Object.keys(this.formErrors).length > 0) {
        console.log(this.formErrors);
        return
      }

      console.log(argins);
      await Cloud[this.pageName].with({
        emailAddress: this.formData.emailAddress,
        token: this.token.token.id,
        plan: this.plan,
        billingCycle: this.billingCycle,
        trial: this.trial
      });
    }
  }
});
