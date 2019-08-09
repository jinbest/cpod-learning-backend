module.exports = {


  friendlyName: 'Create or update customer',


  description: '',


  inputs: {
    userId: {
      type: 'number',
      isInteger: true,
    },
    emailAddress: {
      type: 'string',
      isEmail: true,
      required: true
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
      .create({
        id: inputs.userId,
        email: inputs.emailAddress,
        source: inputs.token,
        name: inputs.fullName
      })
      .then((customer) => {
        customerData = customer;
        sails.log.info(`New User ${customer.id} Created at ${new Date()}`);
      })
      .catch(async (err) => {
        sails.log.info(err.message);
        // errors.shift(err.message);  // Disregard as we expect to hi an existing User Error
        if(err.type === 'StripeCardError'){
          customerData.err = err.message;
          return
        }
        await stripe.customers
          .update(
            `${inputs.userId}`, {
              source: inputs.token,
              name: inputs.fullName
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
      });

    return customerData
  }


};

