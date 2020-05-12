module.exports = {


  friendlyName: 'Update',


  description: 'Update subscription.',


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

    if(!stripeData || !stripeData['subscriptions'] || !stripeData['subscriptions']['data'].length) {

      throw 'invalid'

    }

    if (!stripeData['subscriptions']['data'].map(sub => sub.id).includes(inputs.subscriptionId)) {

      throw 'invalid'

    }

    await stripe.subscriptions.update(inputs.subscriptionId,{ cancel_at_period_end: true })
      .catch(err => sails.hooks.bugsnag.notify(err));

    await Subscriptions.updateOne({subscription_id: inputs.subscriptionId})
      .set({
        status: 1,
        date_cancelled: ''
      })

  }


};
