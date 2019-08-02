module.exports = {


  friendlyName: 'Checkout',


  description: 'Checkout something.',


  inputs: {

    plan: {
      type: 'string'
    },
    billingCycle: {
      type: 'string'
    },
    emailAddress: {
      type: 'string'
    },
    fName: {
      type: 'string'
    },
    lName: {
      type: 'string'
    },
    zip: {
      type: 'string'
    },
    token: {
      type: 'string'
    },

  },


  exits: {
    success: {
      description: 'Subscription Created'
    },
    invalid: {
      responseType: 'badRequest',
      description: 'The provided email address is invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
        'parameters should have been validated/coerced _before_ they were sent.'
    },
  },


  fn: async function (inputs, exits) {
    const stripe = require('stripe')(sails.config.custom.stripeSecret);
    sails.log.info(inputs);

    if (inputs === {}) {
      throw 'invalid'
    }

    // All done.
    if (inputs.token) {
      sails.log.info(inputs.token)
    }
    //TODO Check if Customer Exists
    //Research
    //TODO Create Customer
    const customer = await stripe.customers.create({
      email: inputs.emailAddress,
      source: inputs.token,
    });


    sails.log.info(customer);

    //TODO Subscribe Customer to a Plan
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{plan: 'Monthly Plan -271'}],
      trial_period_days: inputs.trial ? 14 : 0 // No trial
    });


    sails.log.info(subscription);

    //TODO Check Subscriptions Table

    //TODO Check Payments Table

    exits.success();

  }


};
