module.exports = {


  friendlyName: 'Cancel',


  description: 'Cancel subscription.',


  inputs: {
    subscriptionId: {
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

    let stripeData = await stripe.customers.retrieve(inputs.userId.toString())
      .catch(err => sails.hooks.bugsnag.notify(err));

    sails.log.info(stripeData);

    if(!stripeData || !stripeData['subscriptions'] || stripeData['subscriptions']['data'].length < 1) {

      throw 'invalid'

    }

    if (!stripeData['subscriptions']['data'].map(sub => sub.id).includes(inputs.subscriptionId)) {

      throw 'invalid'

    }

    await stripe.subscriptions.del(inputs.subscriptionId)
      .catch(err => sails.hooks.bugsnag.notify(err));

    await Subscriptions.updateOne({subscription_id: inputs.subscriptionId})
      .set({
        status: 2,
        date_cancelled: new Date()
      })

  }


};
