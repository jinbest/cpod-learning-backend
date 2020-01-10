module.exports = {


  friendlyName: 'Calculate fist name',


  description: '',


  inputs: {
    fullName: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const firstNames = require('../../../lib/firstNames');

    try {
      if (inputs.fullName) {
        let firstName = inputs.fullName.split(' ')[0];

        if (firstName && firstName.length > 1) {
          firstName = _.capitalize(firstName.toLowerCase());
          if (firstNames.includes(firstName)) {
            return firstName
          }
        }
      }
    } catch (e) {
      sails.hooks.bugsnag.notify(e);
    }

    return null

  }


};

