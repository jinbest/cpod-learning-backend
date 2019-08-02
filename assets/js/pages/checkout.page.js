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
      paymentInfo: {
        cardNumber: '',
        zipCode: ''
      }
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
    const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
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
    this.card.on('change', function (event) {
      setOutcome(event);
    });
    this.card.on('focus', function (e) {
      $('#card-element').css('border', '1px solid #2487c1');
    });
    this.card.on('blur', function (e) {
      $('#card-element').css('border-color', '#e6e6e6');
    });
    window.setOutcome = function (result) {
      var successElement = document.querySelector('.stripe-success');
      var errorElement = document.querySelector('.stripe-error');
      successElement.classList.remove('visible');
      errorElement.classList.remove('visible');

      if (result.token) {
        // Use the token to create a charge or a customer
        // https://stripe.com/docs/charges
        successElement.querySelector('.token').textContent = result.token.id;
        successElement.classList.add('visible');
      } else if (result.error) {
        errorElement.textContent = result.error.message;
        errorElement.classList.add('visible');
      }
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function() {
      if(this.isEmailVerificationRequired) {
        // If email confirmation is enabled, show the success message.
        this.cloudSuccess = true;
      } else {
        // Otherwise, redirect to the logged-in dashboard.
        // > (Note that we re-enable the syncing state here.  This is on purpose--
        // > to make sure the spinner stays there until the page navigation finishes.)
        this.syncing = true;
        window.location = '/';
      }
    },

    handleParsingForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.formData;

      // Validate email:
      if(!argins.emailAddress || !parasails.util.isValidEmailAddress(argins.emailAddress)) {
        this.formErrors.emailAddress = true;
        console.log(this.formErrors);
      }

      this.stripe.createToken(this.card).then(function(result) {
        if (result.error) {
          // Inform the user if there was an error.
          let errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server.
          argins.token = result.token.id
        }
      });

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    }
  }
});
