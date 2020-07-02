/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

parasails.registerPage('promo' +
  '', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  props: {
    expiry: String
  },
  data: {
    now: Math.trunc((new Date()).getTime() / 1000),
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
    nonRecurring: false,
    permanentDiscount: false,
    pricing:{},
    formData: {
      fName: '',
      lName: '',
      emailAddress: '',
      password: '',
      promoCode: '',
      agreedToTerms: false,
      address1: '',
      address2: '',
      city: '',
      zip: '',
      state: '',
      country: 'US'
    },
    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },
    cardError: false,

    // Syncing / loading state
    syncing: false,
    promoSyncing: false,
    syncingStates: false,

    // Server error state
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    // Payment Errors
    paymentErrors: '',
    modal: '',

    // Stripe
    stripeKey: 'pk_test_4VxncInS2mI0bVeyKWPOGSMY',
    // countries: [{code: "AF", name:"Afghanistan"},{ code: "AL", name:"Albania"},{ code: "DZ", name:"Algeria"},{ code: "AD", name:"Andorra"},{ code: "AO", name:"Angola"},{ code: "AI", name:"Anguilla"},{ code: "AG", name:"Antigua and Barbuda"},{ code: "AR", name:"Argentina"},{ code: "AM", name:"Armenia"},{ code: "AU", name:"Australia"},{ code: "AT", name:"Austria"},{ code: "AZ", name:"Azerbaijan"},{ code: "BS", name:"Bahamas"},{ code: "BH", name:"Bahrain"},{ code: "BD", name:"Bangladesh"},{ code: "BB", name:"Barbados"},{ code: "BY", name:"Belarus"},{ code: "BE", name:"Belgium"},{ code: "BZ", name:"Belize"},{ code: "BJ", name:"Benin"},{ code: "BM", name:"Bermuda"},{ code: "BT", name:"Bhutan"},{ code: "BO", name:"Bolivia"},{ code: "BA", name:"Bosnia and Herzegovina"},{ code: "BW", name:"Botswana"},{ code: "BR", name:"Brazil"},{ code: "BN", name:"Brunei Darussalam"},{ code: "BG", name:"Bulgaria"},{ code: "BF", name:"Burkina Faso"},{ code: "BI", name:"Burundi"},{ code: "KH", name:"Cambodia"},{ code: "CM", name:"Cameroon"},{ code: "CA", name:"Canada"},{ code: "CV", name:"Cape Verde"},{ code: "KY", name:"Cayman Islands"},{ code: "CF", name:"Central African Republic"},{ code: "TD", name:"Chad"},{ code: "CL", name:"Chile"},{ code: "CN", name:"China"},{ code: "CO", name:"Colombia"},{ code: "KM", name:"Comoros"},{ code: "CG", name:"Congo"},{ code: "CR", name:"Costa Rica"},{ code: "HR", name:"Croatia (Hrvatska)"},{ code: "CU", name:"Cuba"},{ code: "CY", name:"Cyprus"},{ code: "CZ", name:"Czech Republic"},{ code: "DK", name:"Denmark"},{ code: "DJ", name:"Djibouti"},{ code: "DM", name:"Dominica"},{ code: "DO", name:"Dominican Republic"},{ code: "EC", name:"Ecuador"},{ code: "EG", name:"Egypt"},{ code: "SV", name:"El Salvador"},{ code: "GQ", name:"Equatorial Guinea"},{ code: "ER", name:"Eritrea"},{ code: "EE", name:"Estonia"},{ code: "ET", name:"Ethiopia"},{ code: "FO", name:"Faroe Islands"},{ code: "FJ", name:"Fiji"},{ code: "FI", name:"Finland"},{ code: "FR", name:"France"},{ code: "GF", name:"French Guiana"},{ code: "PF", name:"French Polynesia"},{ code: "TF", name:"French Southern Territories"},{ code: "GA", name:"Gabon"},{ code: "GM", name:"Gambia"},{ code: "GE", name:"Georgia"},{ code: "DE", name:"Germany"},{ code: "GH", name:"Ghana"},{ code: "GR", name:"Greece"},{ code: "GL", name:"Greenland"},{ code: "GD", name:"Grenada"},{ code: "GP", name:"Guadeloupe"},{ code: "GU", name:"Guam"},{ code: "GT", name:"Guatemala"},{ code: "GN", name:"Guinea"},{ code: "GW", name:"Guinea-Bissau"},{ code: "GY", name:"Guyana"},{ code: "HT", name:"Haiti"},{ code: "HN", name:"Honduras"},{ code: "HK", name:"Hong Kong"},{ code: "HU", name:"Hungary"},{ code: "IS", name:"Iceland"},{ code: "IN", name:"India"},{ code: "ID", name:"Indonesia"},{ code: "IR", name:"Iran"},{ code: "IQ", name:"Iraq"},{ code: "IE", name:"Ireland"},{ code: "IM", name:"Isle of Man"},{ code: "IL", name:"Israel"},{ code: "IT", name:"Italy"},{ code: "CI", name:"Ivory Coast"},{ code: "JM", name:"Jamaica"},{ code: "JP", name:"Japan"},{ code: "JE", name:"Jersey"},{ code: "JO", name:"Jordan"},{ code: "KZ", name:"Kazakhstan"},{ code: "KE", name:"Kenya"},{ code: "KI", name:"Kiribati"},{ code: "XK", name:"Kosovo"},{ code: "KW", name:"Kuwait"},{ code: "KG", name:"Kyrgyzstan"},{ code: "LA", name:"Lao"},{ code: "LV", name:"Latvia"},{ code: "LB", name:"Lebanon"},{ code: "LS", name:"Lesotho"},{ code: "LR", name:"Liberia"},{ code: "LY", name:"Libyan Arab Jamahiriya"},{ code: "LI", name:"Liechtenstein"},{ code: "LT", name:"Lithuania"},{ code: "LU", name:"Luxembourg"},{ code: "MK", name:"Macedonia"},{ code: "MG", name:"Madagascar"},{ code: "MW", name:"Malawi"},{ code: "MY", name:"Malaysia"},{ code: "MV", name:"Maldives"},{ code: "ML", name:"Mali"},{ code: "MT", name:"Malta"},{ code: "MH", name:"Marshall Islands"},{ code: "MQ", name:"Martinique"},{ code: "MR", name:"Mauritania"},{ code: "MU", name:"Mauritius"},{ code: "MX", name:"Mexico"},{ code: "FM", name:"Micronesia, Federated States of"},{ code: "MD", name:"Moldova, Republic of"},{ code: "MC", name:"Monaco"},{ code: "MN", name:"Mongolia"},{ code: "ME", name:"Montenegro"},{ code: "MS", name:"Montserrat"},{ code: "MA", name:"Morocco"},{ code: "MZ", name:"Mozambique"},{ code: "MM", name:"Myanmar"},{ code: "NA", name:"Namibia"},{ code: "NR", name:"Nauru"},{ code: "NP", name:"Nepal"},{ code: "NL", name:"Netherlands"},{ code: "AN", name:"Netherlands Antilles"},{ code: "NC", name:"New Caledonia"},{ code: "NZ", name:"New Zealand"},{ code: "NI", name:"Nicaragua"},{ code: "NE", name:"Niger"},{ code: "NG", name:"Nigeria"},{ code: "KP", name:"North Korea"},{ code: "MP", name:"Northern Mariana Islands"},{ code: "NO", name:"Norway"},{ code: "OM", name:"Oman"},{ code: "PK", name:"Pakistan"},{ code: "PW", name:"Palau"},{ code: "PS", name:"Palestine"},{ code: "PA", name:"Panama"},{ code: "PG", name:"Papua New Guinea"},{ code: "PY", name:"Paraguay"},{ code: "PE", name:"Peru"},{ code: "PH", name:"Philippines"},{ code: "PL", name:"Poland"},{ code: "PT", name:"Portugal"},{ code: "PR", name:"Puerto Rico"},{ code: "QA", name:"Qatar"},{ code: "RE", name:"Reunion"},{ code: "RO", name:"Romania"},{ code: "RU", name:"Russian Federation"},{ code: "RW", name:"Rwanda"},{ code: "KN", name:"Saint Kitts and Nevis"},{ code: "LC", name:"Saint Lucia"},{ code: "VC", name:"Saint Vincent and the Grenadines"},{ code: "WS", name:"Samoa"},{ code: "SM", name:"San Marino"},{ code: "ST", name:"Sao Tome and Principe"},{ code: "SA", name:"Saudi Arabia"},{ code: "SN", name:"Senegal"},{ code: "RS", name:"Serbia"},{ code: "SC", name:"Seychelles"},{ code: "SL", name:"Sierra Leone"},{ code: "SG", name:"Singapore"},{ code: "SK", name:"Slovakia"},{ code: "SI", name:"Slovenia"},{ code: "SB", name:"Solomon Islands"},{ code: "SO", name:"Somalia"},{ code: "ZA", name:"South Africa"},{ code: "KR", name:"South Korea"},{ code: "ES", name:"Spain"},{ code: "LK", name:"Sri Lanka"},{ code: "SH", name:"St. Helena"},{ code: "PM", name:"St. Pierre and Miquelon"},{ code: "SD", name:"Sudan"},{ code: "SR", name:"Suriname"},{ code: "SJ", name:"Svalbard and Jan Mayen Islands"},{ code: "SZ", name:"Swaziland"},{ code: "SE", name:"Sweden"},{ code: "CH", name:"Switzerland"},{ code: "SY", name:"Syrian Arab Republic"},{ code: "TW", name:"Taiwan"},{ code: "TJ", name:"Tajikistan"},{ code: "TZ", name:"Tanzania"},{ code: "TH", name:"Thailand"},{ code: "TG", name:"Togo"},{ code: "TK", name:"Tokelau"},{ code: "TO", name:"Tonga"},{ code: "TT", name:"Trinidad and Tobago"},{ code: "TN", name:"Tunisia"},{ code: "TR", name:"Turkey"},{ code: "TM", name:"Turkmenistan"},{ code: "TV", name:"Tuvalu"},{ code: "UG", name:"Uganda"},{ code: "UA", name:"Ukraine"},{ code: "AE", name:"United Arab Emirates"},{ code: "GB", name:"United Kingdom"},{ code: "US", name:"United States"},{ code: "UM", name:"United States minor outlying islands"},{ code: "UY", name:"Uruguay"},{ code: "UZ", name:"Uzbekistan"},{ code: "VU", name:"Vanuatu"},{ code: "VE", name:"Venezuela"},{ code: "VN", name:"Vietnam"},{ code: "VI", name:"Virgin Islands (U.S.)"},{ code: "WF", name:"Wallis and Futuna Islands"},{ code: "YE", name:"Yemen"},{ code: "ZM", name:"Zambia"},{ code: "ZW", name:"Zimbabwe"}],
    // states: {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",DC:"Washington,D.C",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"},
    addressfield: {}
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {

    window.setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000);
    },1000);

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

    // this.getStates();

// Add an instance of the card Element into the `card-element` <div>.
    this.card.mount('#card-element');
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
    await this.getGeoIP();
    if (this.promoShow && this.formData.promoCode) {
      this.promoToggle = true;
      this.applyPromoCode();
    }
  },

  computed: {
    dynamicAddress () {
      const country = this.addressfield.options.filter((item) => item.iso === this.formData.country);
      let fields = {};
      country[0].fields.forEach((field) => fields = _.merge(fields, field));
      let dynamic = {};
      fields.locality.forEach((field) => dynamic = _.merge(field,dynamic));
      return dynamic
    },
    dateInMilliseconds() {
      return Math.trunc(Date.parse(this.expiry) / 1000)
    },
    seconds() {
      return (this.dateInMilliseconds - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    getGeoIP: async function () {
      await Cloud['ipInfo']()
        .then((response) => {
          if (response.country_code){
            this.formData.country = response.country_code;
          }
          if (response.country_code === 'US'){
            this.formData.state = response.region_code
          }
        })
        .catch(() => {});
    },
    twoDigits (value) {
      if (value < 0) {
        return '00';
      }
      if (value.toString().length <= 1) {
        return `0${value}`;
      }
      return value;
    },
    switchBilling: function (period) {
      this.billingCycle = period;
      this.pricing.discount = 0;
      this.formData.promoCode = '';
      this.promoToggle = false;
    },
    applyPromoCode: async function () {
      this.promoSyncing = true;
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
                this.permanentDiscount = false;
              } else if (info.discount.type === 1) {
                // Fixed Price Discount
                this.pricing.discount = parseFloat(info.discount.value);
                this.permanentDiscount = false;
              } else if (info.discount.type === 2) {
                // Percentage PERMANENT Discount
                this.pricing.discount = (parseFloat(info.discount.value) / 100) * this.pricing[info.discount.plan][info.discount.billingCycle];
                this.permanentDiscount = true;
              }
            } else {
              this.permanentDiscount = false;
              this.pricing.discount = 0;
              this.formErrors.promoCode = true;
              this.promoLimit += 1;
            }
            this.promoSyncing = false;
          })
          .catch((e) => {
            this.permanentDiscount = false;
            this.pricing.discount = 0;
            this.formErrors.promoCode = true;
            this.promoLimit += 1;
            this.promoSyncing = false;
          })
      } else {
        this.permanentDiscount = false;
        this.pricing.discount = 0;
        this.formErrors.promoCode = true;
        this.promoSyncing = false;
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
          // this.modal = 'paymentError';
          this.syncing = false;
          return
        });

      if(!this.token){
        this.syncing = false;
        return
      }


      await Cloud['checkout'].with({
        fName: this.formData.fName,
        lName: this.formData.lName,
        emailAddress: this.formData.emailAddress,
        token: this.token,
        plan: this.plan,
        billingCycle: this.billingCycle,
        trial: this.trial,
        promoCode: this.pricing.discount ? this.formData.promoCode : '',
        address1: this.formData.address1,
        address2: this.formData.address2,
        city: this.formData.city,
        state: this.formData.state,
        country: this.formData.country,
        zip: this.formData.zip,
        nonRecurring: this.nonRecurring
      })
        .then((info) => {
          try {
            fbq('track', 'Purchase', {
              currency: 'USD',
              value: (Math.round((this.pricing[this.plan][this.billingCycle] - this.pricing.discount) * 100) / 100).toFixed(2),
              content_category: this.plan.toUpperCase(),
              content_name: `${this.pricing.discount ? this.formData.promoCode : ''} ${this.plan.toUpperCase()} - ${this.billingCycle.toUpperCase()}`
            })
          } catch (e) {}
          window.location.href = window.location.href.split('?')[0] + '/success';
        })
        .catch((e) => {
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

      if (document.getElementById('card-errors').textContent){
        this.formErrors.cardError = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        this.syncing = false;
        return
      }

      return argins;
    },
    focusOnForm () {
      document.getElementById('checkout-form').scrollIntoView({ block: 'end',  behavior: 'smooth' });
      document.getElementById('first-name').focus();
    },
    getCountries () {},
    async switchBilling (cycle) {
      this.billingCycle = cycle;
      await this.applyPromoCode()
    }
  }
});
