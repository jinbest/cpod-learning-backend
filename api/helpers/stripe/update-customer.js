module.exports = {


  friendlyName: 'Update customer',


  description: '',


  inputs: {
    userId: {
      type: 'number',
      isInteger: true,
    },
    fullName: {
      type: 'string',
      required: true
    },
    token: {
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const stripe = require('stripe')(sails.config.custom.stripeSecret);

    let customerData = {};

    await stripe.customers
      .update(
        `${inputs.userId}`, {
          source: inputs.token,
        })
      .then((customer) => {
        customerData = customer;
        sails.log.info(`Found User ${customer.id} at ${new Date()}`);
      })
      .catch((err) => {
        // This should not fail - if that's the case - something wrong with user record
        sails.log.error(err.message);
        customerData.err = err.message;
      });

    return customerData
  }


};

