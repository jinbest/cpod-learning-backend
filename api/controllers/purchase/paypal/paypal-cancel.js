module.exports = {


  friendlyName: 'Paypal Cancel',


  description: 'Cancel paypal.',


  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {

    redirect: {
      description: 'Paypal payment cancelled, redirecting ...',
      responseType: 'redirect'
    },

    invalidOrExpiredToken: {
      responseType: 'expired',
      description: 'The provided token is expired, invalid, or already used up.',
    },
  },


  fn: async function (inputs) {

    try {
      await Transactions.destroyOne({subscription_id: inputs.token});
      await Subscriptions.destroyOne({subscription_id: inputs.token});
    } catch (e) {
      sails.log.error(e);
      throw {redirect: '/home'}
    }

    throw {redirect: '/home'}

  }


};
