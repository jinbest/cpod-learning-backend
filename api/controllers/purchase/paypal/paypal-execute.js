module.exports = {


  friendlyName: 'Execute',


  description: 'Execute paypal.',


  inputs: {
    data: {
      type: {},
      required: true
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Paypal error',
    },

  },




  fn: async function (inputs) {

    const ipdata =  require('ipdata');

    var execute_payment_json = {
      "payer_id": inputs.data.payerID,
    };
    const payment ={};

    payment.amount = inputs.data.amount;

    const paymentID = inputs.data.paymentID;

    let paymentData = {};

    await new Promise((resolve, reject) => {
      PaypalService.paymentPaypal(paymentID,execute_payment_json,payment, (err,result)=>{
        if(err) {
          reject(err);
        }
        return resolve(result)
      });
    }).then((data) => {paymentData = data})
      .catch((err) => sails.log.error(err));

    if (!paymentData) {
      throw 'invalid'
    }

    let ipData = {};

    if(this.req.ip && this.req.ip !== '::1') {
      await ipdata.lookup(this.req.ip, sails.config.custom.ipDataKey)
        .then((info) => {
          ipData = info;
        })
        .catch((err) => {
          sails.log.error(err);
        });
    }

    await Transactions.create({
      subscription_id: null,
      user_id: this.req.session && this.req.session.userId ? this.req.session.userId : 0,
      billed_amount: paymentData.amount,
      pay_status: 2,
      pay_method: 10,
      notes: `CPOD JS PAGE - Paypal One Off - ${paymentData.first_name} ${paymentData.last_name} <${paymentData.email}>`,
      region: ipData['region'] ? ipData['region'] : null,
      country: ipData['country_name'] ? ipData['country_name'] : null,
      city: ipData['city'] ? ipData['city'] : null,
      ip_address: this.req.ip,
      created_by: this.req.session && this.req.session.userId ? this.req.session.userId : 0,
      modified_by: this.req.session && this.req.session.userId ? this.req.session.userId : 0,
    });

    return {
      success: 1,
      amount: paymentData.amount
    }
  }


};
