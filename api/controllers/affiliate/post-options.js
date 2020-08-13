module.exports = {


  friendlyName: 'Post options',


  description: '',


  inputs: {
    affiliate_company: {
      type: 'string'
    },
    affiliate_website: {
      type: 'string'
    },
    affiliate_bank_account: {
      type: 'string'
    },
    affiliate_bank_account_owner: {
      type: 'string'
    },
    affiliate_bank_account_routing: {
      type: 'string'
    },
    affiliate_paypal_account: {
      type: 'string'
    },
    affiliate_email_notifications: {
      type: 'boolean'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let promises = [];

    Object.keys(inputs).forEach(key => {
      promises.push(
        UserOptions.updateOrCreate({
          user_id: inputs.userId,
          option_key: key
        },{
          user_id: inputs.userId,
          option_key: key,
          option_value: inputs[key]
        })
      )
    });

    return await Promise.all(promises);

  }


};
