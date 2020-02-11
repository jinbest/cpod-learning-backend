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
    payment.currency = inputs.data.currency ? inputs.data.currency : 'USD';

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

    sails.log.info(paymentData);
    sails.log.info(inputs.data);

    if(this.req.ip && this.req.ip !== '::1') {
      try {
        await ipdata.lookup(this.req.ip, sails.config.custom.ipDataKey)
          .then((info) => {
            ipData = info;
          })
          .catch((err) => {
            sails.log.error(err);
          });
      } catch (e) {

      }

    }

    let transaction = await Transactions.create({
      subscription_id: null,
      user_id: this.req.session && this.req.session.userId ? this.req.session.userId : 0,
      transaction_id: paymentData.transactionId,
      product_price: paymentData.amount,
      billed_amount: paymentData.amount,
      currency: paymentData.currency,
      pay_status: 2,
      pay_method: 10, // NEW PAYPAL ACCOUNT - 10
      notes: `CPOD JS PAGE - Paypal One Off - ${paymentData.first_name} ${paymentData.last_name} <${paymentData.email}>`,
      region: ipData['region'] ? ipData['region'] : null,
      country: ipData['country_name'] ? ipData['country_name'] : null,
      city: ipData['city'] ? ipData['city'] : null,
      ip_address: this.req.ip,
      created_by: this.req.session && this.req.session.userId ? this.req.session.userId : 0,
      modified_by: this.req.session && this.req.session.userId ? this.req.session.userId : 0,
    }).fetch();

    if (paymentData.shipping_address && paymentData.shipping_address.line1  && paymentData.shipping_address.country_code) {
      await TransactionAddresses.create({
        transaction_id: transaction.id,
        city: paymentData.shipping_address.city,
        country: paymentData.shipping_address.country_code,
        state: paymentData.shipping_address.state,
        zip_code: paymentData.shipping_address.postal_code,
        full_name: paymentData.shipping_address.recipient_name,
        address1: paymentData.shipping_address.line1,
        address2: paymentData.shipping_address.line1,
      });
    }

    return {
      success: 1,
      amount: paymentData.amount,
      currency: paymentData.currency
    }
  }


};
