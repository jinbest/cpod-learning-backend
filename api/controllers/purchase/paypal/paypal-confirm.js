module.exports = {


  friendlyName: 'Paypal Confirm Subscription',


  description: 'Confirm paypal subscription.',


  inputs: {
    token: {
      type: 'string',
      required: true
    }

  },


  exits: {

    redirect: {
      description: 'Paypal payment successful, redirecting ...',
      responseType: 'redirect'
    },

    invalidOrExpiredToken: {
      responseType: 'expired',
      description: 'The provided token is expired, invalid, or already used up.',
    },
  },


  fn: async function (inputs) {

    const subcriptionPlansToPlanIDs = {
      1: 6,
      2: 5
    };

    let paypalData = await new Promise((resolve, reject) => {
      PaypalService.processPaymentAgreement(inputs.token, (err, result) => {
        if (err) {
          reject(err)
        }
        return resolve(result)
      });
    })
      .then((data) => {
        sails.log.info({paypalData: data});
        return data
      })
      .catch((err) => {
        sails.log.error(err);
        throw 'invalidOrExpiredToken'
      });

    sails.log.info({realPaypalData: paypalData});
    sails.log.info({payer: paypalData.payer});

    // Confirm Transaction
    let transaction = await Transactions.updateOne({subscription_id: inputs.token})
      .set({
        subscription_id: paypalData.id,
        pay_status: 2, // Paid
        paypal_email: paypalData['payer']['payer_info']['email']
      });

    if (!transaction) {
      throw 'invalidOrExpiredToken'
    }

    // Create a Subscription entry
    let cpodsubscription = await Subscriptions.updateOne({subscription_id: inputs.token})
      .set({
        subscription_id: transaction.subscription_id,
        status: 1, //  1=active, 2=cancelled, 3=past due
        next_billing_time: paypalData['agreement_details']['next_billing_date']
      });

    // Update User Access on UserSiteLinks
    const userSiteLinks = UserSiteLinks.updateOne({user_id: cpodsubscription.user_id, site_id: 2})
      .set({usertype_id: subcriptionPlansToPlanIDs[cpodsubscription.subscription_type]});

    // Success;
    if (transaction && cpodsubscription) {
      throw {redirect: '/home'}
    } else {
      throw 'invalidOrExpiredToken'
    }
  }


};
