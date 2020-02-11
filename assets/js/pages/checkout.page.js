parasails.registerPage('checkout', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    trial: false,
    plan: 'premium',
    billingCycle: 'monthly',
    paymentMethod: 'stripe',
    needsAccount: false,
    needsOnboarding: true,
    enablePaypal: false,
    promoShow: false,
    promoToggle: false,
    promoLimit: 0,
    pricing:{},
    formData: {
      fName: '',
      lName: '',
      emailAddress: '',
      password: '',
      promoCode: '',
      agreedToTerms: false,
      zip: ''
    },
    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: {
      // emailAddress: true,
      // fName: true,
      // lName: true
    },
    cardError: false,

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    // Payment Errors
    paymentErrors: '',
    modal: '',

    // Stripe
    stripeKey: 'pk_test_4VxncInS2mI0bVeyKWPOGSMY',

    paypalClient: {
      sandbox: 'AZGCQyxdYVNlEao8bzD7tMrccqocSl4hjZmhR6nZ8bL7rCewPXRywjP-uwolycnyIodbL5oQvN8dixZE',
      production: 'AWZiTif-WpZUU8mjN2PbrRy_fTYDj2-_VqswzgiEUepQZc7g-jFJFaB4OjnSeU00UQtsReGPMo_tQ7yu'
    }
  },

  computed: {
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
    const stripe = Stripe(this.stripeKey);
    this.stripe = stripe;

// Create an instance of Elements.
    const elements = stripe.elements();

    this.card = elements.create('card', {
      hidePostalCode: true,
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
    this.card.addEventListener('change', function(event) {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.style.display = "block";
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
        displayError.style.display = "none";
      }
    });
    if (this.promoShow && this.formData.promoCode) {
      this.promoToggle = true;
      this.applyPromoCode();
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    switchBilling: function (period) {
      this.billingCycle = period;
      this.pricing.discount = 0;
      this.formData.promoCode = '';
      this.promoToggle = false;
    },
    applyPromoCode: async function () {
      this.syncing = true;
      this.formErrors = {};
      if (this.formData.promoCode && this.promoLimit < 6) {
        // Check code for validity
        await Cloud['checkPromo'].with({
          promoCode: this.formData.promoCode,
          plan: this.plan,
          billingCycle: this.billingCycle,
          fName: this.formData.fName,
          lName: this.formData.lName,
          emailAddress: this.formData.emailAddress,
        })
          .then((info) => {
            //Valid Promo Code
            if (info.success && this.plan === info.discount.plan && this.billingCycle === info.discount.billingCycle) {
              if (info.discount.type === 0) {
                // Percentage Discount
                this.pricing.discount = (parseFloat(info.discount.value) / 100) * this.pricing[info.discount.plan][info.discount.billingCycle];
              }
              if (info.discount.type === 1) {
                // Fixed Price Discount
                this.pricing.discount = parseFloat(info.discount.value);
              }
            } else {
              this.formErrors.promoCode = true;
              this.promoLimit += 1;
            }
            this.syncing = false;
          })
          .catch((e) => {
            console.log(e.responseInfo);
            this.formErrors.promoCode = true;
            this.promoLimit += 1;
            this.syncing = false;
          })
      } else {
        this.formErrors.promoCode = true;
        this.syncing = false;
      }
    },
    loginForm: async function() {
      this.needsAccount = false;
      this.modal = '';
      this.syncing = false;
      this.handleSubmitting();
    },
    checkEmail: async function() {
      return await Cloud['checkEmail'].with({
        emailAddress: this.formData.emailAddress
      })
        .then((response) => {
          return response
        })
        .catch((err) => {
          return
        });
    },
    submittedForm: async function() {
    },
    handleSubmitting: async function() {
      this.syncing = true;
      if (this.needsAccount) {
        // Check Email for Existing Account
        let existingAccount = await this.checkEmail();
        if (existingAccount.userData) {
          this.modal = 'loginModal';
          return false
        }
      }

      await this.stripe.createToken(this.card)
        .then((card) => {
          this.token = card.token.id;
        })
        .catch((e) => {
          console.log(e);
          // this.modal = 'paymentError';
          this.syncing = false;
          return
        });

      if(!this.token){
        this.syncing = false;
        return
      }

      await Cloud[this.pageName].with({
        fName: this.formData.fName,
        lName: this.formData.lName,
        emailAddress: this.formData.emailAddress,
        token: this.token,
        plan: this.plan,
        billingCycle: this.billingCycle,
        trial: this.trial,
        promoCode: this.pricing.discount ? this.formData.promoCode : ''
      })
        .then((info) => {
          console.log('Successful Subscription');
          this.cloudSuccess = true;
          setTimeout(() => {
            window.location = this.needsOnboarding ? '/level' : '/home';
          }, 2000);
        })
        .catch((e) => {
          console.log('Payment Method declined');
          this.paymentErrors = e.responseInfo.body;
          this.modal = 'paymentError';
          this.syncing = false;
        })
    },
    handleParsingForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      this.syncing = true;

      var argins = this.formData;

      // Validate email:
      if(!argins.emailAddress || !parasails.util.isValidEmailAddress(argins.emailAddress)) {
        this.formErrors.emailAddress = true;
      }

      // Validate name:
      if (!argins.fName) {
        this.formErrors.fName = true;
      }
      if (!argins.lName) {
        this.formErrors.lName = true;
      }
      if (this.needsAccount && !argins.agreedToTerms) {
        this.formErrors.agreedToTerms = true;
      }

      if (document.getElementById('card-errors').textContent){
        this.formErrors.cardError = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        this.syncing = false;
        return
      }
      return argins;
    },
    async paypalCheckout () {
      this.syncing = true;

      let data = this.handleParsingForm();
      if (!data) {
        this.syncing = false;
        return
      } else {
        if (this.needsAccount) {
          // Check Email for Existing Account
          let existingAccount = await this.checkEmail();
          if (existingAccount.userData) {
            this.modal = 'loginModal';
            this.syncing = false;
            return false
          }
        }
        await Cloud['paypalCreate'].with({
          fName: this.formData.fName,
          lName: this.formData.lName,
          emailAddress: this.formData.emailAddress,
          token: this.token,
          plan: this.plan,
          billingCycle: this.billingCycle,
          trial: this.trial,
          promoCode: this.pricing.discount ? this.formData.promoCode : ''
        })
          .then((info) => {
            window.open(info.redirect, '_blank');
            this.syncing = false;
            // this.cloudSuccess = true;
            // setTimeout(() => {
            //   window.location = this.needsOnboarding ? '/level' : '/dash';
            // }, 2000);
          })
          .catch((e) => {
            console.log(e.responseInfo.body);
            this.paymentErrors = e.responseInfo.body;
            this.modal = 'paymentError';
            this.syncing = false;
          })
      }
    }
  }
});
