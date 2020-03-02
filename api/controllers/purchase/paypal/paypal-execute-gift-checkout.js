module.exports = {


  friendlyName: 'Paypal execute gift checkout',


  description: '',


  inputs: {

    data: {
      type: {},
      required: true
    }

  },


  exits: {

    success: {
      description: 'Gift Created'
    },
    declined: {
      description: 'The provided payment method is invalid.'
    }

  },


  fn: async function (inputs) {

    const plans = {
      premium: {
        id: 5,
        type: 2,
        monthly: {
          id: 2,
          stripeId: 'Monthly Plan -2',
          length: 1,
          price: 20.00,
        },
        quarterly: {
          id: 18,
          stripeId: 'Quarterly Plan -18',
          length: 3,
          price: 39.00,
        },
        annually: {
          id: 140,
          stripeId: 'Annual Plan -140',
          length: 12,
          price: 149.00,
        }
      }
    };

    //TODO Revise this
    let discount = false;

    let ipData = {};

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

    sails.log.info(paymentData);
    sails.log.info(inputs.data);

    let moment = require('moment');
    let expiry = moment(new Date()).add(12, 'months').toDate();

    let voucher = await Vouchers.create({
      voucher_code: await sails.helpers.strings.random('url-friendly').slice(0,10).toUpperCase(),
      product_id: plans[inputs.data.plan][inputs.data.billingCycle].id,
      expiry_date: expiry,
    })
      .intercept('E_UNIQUE', () => {sails.hooks.bugsnag.notify('Voucher already exists')})
      .fetch();

    //TODO Cleanup this somehow
    if (!voucher) {
      voucher = await Vouchers.create({
        voucher_code: await sails.helpers.strings.random('url-friendly').slice(0,10).toUpperCase(),
        product_id: plans[inputs.data.plan][inputs.data.billingCycle].id,
        expiry_date: expiry,
      })
        .intercept('E_UNIQUE', () => {sails.hooks.bugsnag.notify('Voucher already exists')})
        .fetch();
    }

    if (!ipData['country_name']) {
      const IPData = require('ipdata').default;
      const ipdata = new IPData( sails.config.custom.ipDataKey);

      if(this.req.ip && this.req.ip !== '::1') {
        try {
          await ipdata.lookup(this.req.ip)
            .then((info) => {
              ipData = info;
            })
            .catch((err) => {
              sails.log.error(err);
              sails.hooks.bugsnag.notify(err);
            });
        } catch (e) {
          sails.log.error(e)
        }
      }
    }


    //Log Transaction
    let transaction = await Transactions.create({
      subscription_id: null,
      transaction_id: paymentData.transactionId,
      user_id: inputs.userId,
      product_id: plans[inputs.data.plan][inputs.data.billingCycle].id,
      product_length: plans[inputs.data.plan][inputs.data.billingCycle].length,
      product_price: plans[inputs.data.plan][inputs.data.billingCycle].price,
      discount: discount ? discount : 0.00,
      billed_amount: paymentData.amount,
      promotion_code: inputs.data.promoCode ? inputs.data.promoCode : null,
      currency: paymentData.currency,
      pay_status: 2,
      pay_method: 10,
      notes: `${paymentData.first_name} ${paymentData.last_name} - GIFT OF LANGUAGE - ${voucher.id} - ${voucher.voucher_code}`,
      region: ipData['region'] ? ipData['region'] : null,
      country: ipData['country_name'] ? ipData['country_name'] : null,
      city: ipData['city'] ? ipData['city'] : null,
      ip_address: this.req.ip,
      created_by: this.req.session && this.req.session.userId ? this.req.session.userId : 0,
      modified_by: this.req.session && this.req.session.userId ? this.req.session.userId : 0,
    }).fetch();

    let productName = `${inputs.trial ? 'Trial ' : ''}${_.capitalize(inputs.plan)} Subscription ${transaction.product_length} Months`;

    this.req.visitor
      .event('payment', 'payment')
      .transaction(transaction.id, transaction.billed_amount)
      .item(transaction.billed_amount, 1, transaction.product_id, productName)
      .send();

    let userData = await User.findOne({email: inputs.data.emailAddress});

    if (!userData) {

      let user = {};

      user.name = inputs.data.fName + ' ' + inputs.data.lName ;

      userData = await User.create({
        email: inputs.data.emailAddress,
        password: await sails.helpers.passwordGenerate(),
        username: user.name.split(' ').join('') + Math.ceil(Math.random() * 100),
        name: user.name,
        ip_address: null,
        ip_country: null,
        ip_region: null,
        ip_city: null,
        country: null,
        city: null,
        http_referer: '',
        code: await sails.helpers.strings.random('url-friendly'),
        confirm_status: 0
      }).fetch();

    }

    //TODO DESIGN GIFT VOUCHER EMAIL
    await sails.helpers.sendTemplateEmail.with({
      to: userData.email, //'recap-request@chinesepod.com',
      subject: `${inputs.data.senderName ? inputs.data.senderName : 'Someone'} has just sent you a gift of language, receive the gift now!`,
      template: 'automated/email-gift',
      layout: false,
      toName: inputs.data.fName + ' ' + inputs.data.lName,
      templateData: {
        firstName: inputs.data.fName,
        claimLink: `https://www.chinesepod.com/redeem-gift/${voucher.voucher_code}/${userData.code}`
      }
    });

    return {
      success: 1
    }

  }


};
