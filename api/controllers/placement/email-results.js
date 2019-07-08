module.exports = {


  friendlyName: 'Email placement test results',


  description: 'Takes the results of an',


  inputs: {

    emailAddress: {
      required: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the placement test user, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },
    results: {
      type: 'string',
      description: 'User placement results in JSON format',
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'The provided email address does not match a user.',
    },
  },


  fn: async function (inputs) {

    //TODO validate JSON

    await sails.helpers.sendTemplateEmail.with({
      to: email,
      subject: 'Placement Test Results',
      template: 'email-placement-results',
      templateData: {
        email: inputs.emailAddress,
        results: inputs.results,
      }
    });

    return;

  }


};
