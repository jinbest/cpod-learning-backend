module.exports = {


  friendlyName: 'Request Parameter dump',



  exits: {

    success: {
      description: 'Health Check Passed'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
        'parameters should have been validated/coerced _before_ they were sent.'
    },

  },

  fn: async function () {
    var req = this.req;
    return req.ips;
  }
};
