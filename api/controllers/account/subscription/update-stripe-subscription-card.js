module.exports = {


  friendlyName: 'Update',


  description: 'Update subscription.',


  inputs: {
    subscriptionId: {
      type: 'string',
      required: true
    },
    token: {
      type: 'string',
      required: true
    },
    fullName: {
      type: 'string',
      required: true
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    const stripe = require('stripe')(sails.config.custom.stripeSecret);

    let customerData = await stripe.customers
      .update(
        `${inputs.userId}`, {
          source: inputs.token,
          name: inputs.fullName
        })
      .catch(err => sails.hooks.bugsnag.notify(err));

    if (customerData && customerData.sources && customerData.sources.data && customerData.sources.data[0]) {
      let cardData = customerData.sources.data[0]
      await Subscriptions.updateOne({subscription_id: inputs.subscriptionId, user_id: inputs.userId})
        .set({
          cc_num: cardData.last4,
          cc_exp: `${cardData.exp_month}/${cardData.exp_year}`
        })
    } else {
      throw new Error('Invalid Payment Method')
    }

  }


};
