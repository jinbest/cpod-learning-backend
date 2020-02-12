/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

parasails.registerPage('valentines-day', {
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
    paymentMethod: 'paypal',
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
    ppData: '',

    client: '',
    ppMode: '',
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

    this.renderPayPal();

    // await this.getGeoIP();
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
    twoDigits(value) {
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
              }
              if (info.discount.type === 1) {
                // Fixed Price Discount
                this.pricing.discount = parseFloat(info.discount.value);
              }
            } else {
              this.formErrors.promoCode = true;
              this.promoLimit += 1;
            }
            this.promoSyncing = false;
          })
          .catch((e) => {
            this.formErrors.promoCode = true;
            this.promoLimit += 1;
            this.promoSyncing = false;
          })
      } else {
        this.formErrors.promoCode = true;
        this.promoSyncing = false;
      }
    },
    loginForm: async function () {
      this.needsAccount = false;
      this.modal = '';
      this.syncing = false;
      await this.processPayment();
    },
    checkEmail: async function () {
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
    submittedForm: async function () {
    },
    handleParsingForm: function () {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      this.syncing = true;

      var argins = this.formData;

      // Validate email:
      if (!argins.emailAddress || !parasails.util.isValidEmailAddress(argins.emailAddress)) {
        this.formErrors.emailAddress = true;
      }

      // Validate name:
      if (!argins.fName) {
        this.formErrors.fName = true;
      }
      if (!argins.lName) {
        this.formErrors.lName = true;
      }

      if (Object.keys(this.formErrors).length > 0) {
        this.syncing = false;
        return
      }

      return argins;
    },
    focusOnForm() {
      document.getElementById('checkout-form').scrollIntoView({block: 'end', behavior: 'smooth'});
      document.getElementById('first-name').focus();
    },
    async sendDataPaypal (data) {
      this.syncing = true;

      await Cloud['paypalExecuteCheckout'].with(data)
        .then(res => {
          if (res.success) {
            window.location.href = '/valentines-day/success'
          } else {
            console.log(res);
            this.modal = 'paymentError';
            this.syncing = false;  // to display  the error message
          }
        })
        .catch((e) => {
          console.log(e);
          this.paymentErrors = e.responseInfo.body;
          this.modal = 'paymentError';
          this.syncing = false;  // to display  the error message
        })
    },
    async processPayment (){
      this.syncing = true;
      await this.handleParsingForm();

      if (Object.keys(this.formErrors).length > 0) {
        return
      }

      if (this.needsAccount) {
        // Check Email for Existing Account
        let existingAccount = await this.checkEmail();
        if (existingAccount.userData) {
          this.modal = 'loginModal';
          this.syncing = false;
          return false
        }
      }

      let payload = {
        plan: this.plan,
        billingCycle: this.billingCycle,
        paymentID: this.ppData.paymentID,
        payerID: this.ppData.payerID,
        amount: (Math.round((this.pricing[this.plan][this.billingCycle] - this.pricing.discount) * 100) / 100).toFixed(2),
        currency: this.formData.currency,
        fName: this.formData.fName,
        lName: this.formData.lName,
        emailAddress: this.formData.emailAddress,
        senderName: this.formData.senderName
      };

      await this.sendDataPaypal({data:payload});

    },
    renderPayPal() {
      let client = this.client;

      let  payment = async (data, actions) => {

        let amount = (Math.round((this.pricing[this.plan][this.billingCycle] - this.pricing.discount) * 100) / 100).toFixed(2);

        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: { total: amount, currency: this.formData.currency }
              }
            ]
          }
        });
      };

      let onAuthorize = async (data) => {
        this.ppData = data;
        this.syncing = false;

        await this.processPayment();

      };

      paypal.Button.render({
        env: this.ppMode, // sandbox | production
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
    }
  }
});
