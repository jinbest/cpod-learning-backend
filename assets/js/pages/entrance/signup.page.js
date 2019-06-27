parasails.registerPage('signup', {
    //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
    //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
    //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
    data: {
      // Form data
      formData: {
        optIn: true,
        emailAddress: '',
        showFooter: true
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

      //Verify Email Addresses
      isEmailVerificationRequired: true,
    },

    //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
    //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
    //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
    beforeMount: function() {
      // Attach any initial data from the server.
      _.extend(this, SAILS_LOCALS);
      var self = this;
    },
    mounted: async function() {
      document.getElementById('page-footer').style = 'display: flex';
    },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

  submittedForm: async function() {
    console.log('Submitted Form');
    if(this.isEmailVerificationRequired) {
      // If email confirmation is enabled, show the success message.
      this.cloudSuccess = true;
      console.log('User Created');
    }
    else {
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
    console.log('Form Submit');


    var argins = this.formData;

    // Validate email:
    if(!argins.emailAddress || !parasails.util.isValidEmailAddress(argins.emailAddress)) {
      console.log('Invalid Email');
      this.formErrors.emailAddress = true;
      console.log(this.formErrors)
    }

    // If there were any issues, they've already now been communicated to the user,
    // so simply return undefined.  (This signifies that the submission should be
    // cancelled.)
    if (Object.keys(this.formErrors).length > 0) {
      return;
    }

    console.log('Form Valid');

    return argins;
  }
}
});
