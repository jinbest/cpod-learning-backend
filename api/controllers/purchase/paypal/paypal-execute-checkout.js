/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

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
    declined: {
      description: 'The provided payment method is invalid.'
    },
    trialAlreadyUsed: {
      description: 'User has already used a trial subscription before.'
    },
    loginFirst: {
      description: 'User email is not unique and should log in before checkout.'
    }

  },




  fn: async function (inputs) {

    const stripe = require('stripe')(sails.config.custom.stripeSecret);

    const plans = {
      premium: {
        id: 5,
        type: 2,
        monthly: {
          id: 2,
          stripeId: 'Monthly Plan -2',
          length: 1,
          price: 29.00,
        },
        quarterly: {
          id: 18,
          stripeId: 'Quarterly Plan -18',
          length: 3,
          price: 79.00,
        },
        annually: {
          id: 140,
          stripeId: 'Annual Plan -140',
          length: 12,
          price: 249.00,
        },
        monthlyTrial: {
          id: 271,
          stripeId: 'Monthly Plan -271',
          length: 1,
          price: 29.00,
        }
      },
      basic: {
        id: 6,
        type: 1,
        monthly: {
          id: 13,
          stripeId: 'Monthly Plan -13',
          length: 1,
          price: 14.00,
        },
        quarterly: {
          id: 14,
          stripeId: 'Quarterly Plan -14',
          length: 3,
          price: 39.00,
        },
        annually: {
          id: 142,
          stripeId: 'Annual Plan -142',
          length: 12,
          price: 124.00,
        },
      },
      holiday: {
        id: 5,
        type: 2,
        description: 'Holiday Offer - $1',
        monthly: {
          id: 2,
          stripeId: 'Monthly Plan -2',
          length: 1,
          price: 29.00,
          setupFee: 0.99
        }
      },
      class: {
        //Nothing Yet
      }
    };

    //TODO Revise this
    let discount = false;

    let ipData = {};

    if (!this.req.me) {

      // Create a new User
      const email = inputs.data.emailAddress.toLowerCase();
      const IPData = require('ipdata').default;
      const ipdata = new IPData( sails.config.custom.ipDataKey);

      let password = await sails.helpers.passwordGenerate();

      if(this.req.ip && this.req.ip !== '::1') {
        try {
          await ipdata.lookup(this.req.ip)
            .then((info) => {
              ipData = info;
            })
            .catch((err) => {
              sails.hooks.bugsnag.notify(err);
              sails.log.error(err);
            });
        } catch (e) {
          sails.log.error(e)
        }

      }

      let name = `${inputs.data.fName} ${inputs.data.lName}`;
      let userName = name.replace(' ', '');
      userName += Math.floor(Math.random() * Math.floor(500));

      // Create new User record
      let newUserRecord = await User.create(_.extend({
        email: email,
        password: await sails.helpers.passwordHash.with({
          password: password,
          method: 'E'
        }),
        username: userName,
        name: name,
        ip_address: this.req.ip,
        ip_country: ipData['country_name'],
        ip_region: ipData['region'],
        ip_city: ipData['city'],
        country: ipData['country_name'],
        city: ipData['city'],
        http_referer: this.req.headers.referer ? this.req.headers.referer : '',
        code: await sails.helpers.strings.random('url-friendly'),
        confirm_status: 0
      }))
        .intercept('E_UNIQUE', 'loginFirst')
        .intercept({name: 'UsageError'}, 'invalid')
        .fetch();

      let newUserSite = await UserSiteLinks.create(_.extend({
        user_id: newUserRecord.id,
        usertype_id: 7, //Free
        expiry: new Date().toISOString()
      }, inputs.data.optIn ? {
        academic_email: 1,
        activity_email: 1,
        other_email: 1,
        show_email: 1,
        newsletter_email: 1,
        meetup_email: 1,
      }:{}))
        .fetch();

      // Store the user's new id in their session.
      inputs.userId = this.req.session.userId = newUserRecord.id;

      let mauticLead = await sails.helpers.mautic.createContact.with({
        email: email,
        userId: newUserRecord.id,
        optIn: inputs.data.optIn,
        ipData: ipData
      }).catch((e) => {
        sails.hooks.bugsnag.notify(e);
        sails.log.error(e)
      });

      if (sails.config.custom.verifyEmailAddresses) {
        await sails.helpers.sendTemplateEmail.with({
          to: email,
          subject: 'Please confirm your account',
          template: 'email-verify-account',
          templateData: {
            fullName: name,
            email: email,
            password: password,
            token: newUserRecord.code ? newUserRecord.code : '',
            mobile: false,
            confirmation: false
          }
        });
      } else {
        sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
      }

    } else {

      inputs.userId = this.req.me.id;

      // Check if User has Used a Trial before
      if (inputs.data.trial) {
        let userTrial = await User.findOne({id: inputs.userId});
        sails.log.info(userTrial);
        if (userTrial.trial) {
          delete this.req.session.trial;
          await sails.helpers.mailgun.sendHtmlEmail.with({
            htmlMessage: `
            <p>Failed to Start a Free Trial on https://www.chinesepod.com</p>
            <br />
            <p>Name: ${inputs.data.fName} ${inputs.data.lName}</p>
            <p>Email: ${inputs.data.emailAddress}</p>
            <br />
            <p>Error: Unfortunately, you can only enroll in a trial subscription once.
            It was already redeemed on ${new Date(userTrial.trial.toString()).toLocaleString()}</p>
            <br />
            <p>Cheers,</p>
            <p>The Friendly ChinesePod Contact Robot</p>
            `,
            to: 'followup@chinesepod.com',
            subject: 'Failed User Trial',
            from: 'errors@chinesepod.com',
            fromName: 'ChinesePod Errors'
          });
          throw {trialAlreadyUsed: `Unfortunately, you can only enroll in a trial subscription once.
        It was already redeemed on ${new Date(userTrial.trial.toString()).toLocaleString()}`};
        }
      }
    }

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

    const existingSubscriptions = await Subscriptions.find({
      user_id: inputs.userId,
      status: 1,
      next_billing_time: {
        '>=': new Date()
      }
    });

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
      notes: 'CPOD JS PAGE - PAYPAL',
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

    if (existingSubscriptions.length > 0) {
      const asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array)
        }
      };

      await asyncForEach(existingSubscriptions, async (subscription) => {
        if(subscription.subscription_from === 7) {
          await stripe.subscriptions.del(subscription.subscription_id)
            .then( async (confirmation) => {
              sails.log.info('cancelling subscription');
              await Subscriptions.updateOne({subscription_id: subscription.subscription_id})
                .set({
                  status: 2,
                  date_cancelled: new Date()
                });
              await sails.helpers.mailgun.sendHtmlEmail.with({
                htmlMessage: `
                        <p>Duplicate ChinesePod Stripe Subscription Created https://www.chinesepod.com</p>
                        <br />
                        <p>Name: ${inputs.data.fName} ${inputs.data.lName}</p>
                        <p>Email: ${inputs.data.emailAddress}</p>
                        <br />
                        ${inputs.data.promoCode ? `<p>Code: ${inputs.data.promoCode}</p>` : ''}
                        <p>Product: ${inputs.data.plan} - ${inputs.data.billingCycle}</p>
                        <p>Existing Subscription:</p>
                        <p>Subscription ID: ${subscription.subscription_id}</p>
                        <br />
                        <p>Cheers,</p>
                        <p>The Friendly ChinesePod Contact Robot</p>
                        `,
                to: 'followup@chinesepod.com',
                subject: 'Duplicate ChinesePod Subscriptions',
                from: 'subscriptions@chinesepod.com',
                fromName: 'ChinesePod Subscriptions'
              });
            })
            .catch(async(e) => {
              sails.log.error(e);
              // sails.hooks.bugsnag.notify(e);
              await sails.helpers.mailgun.sendHtmlEmail.with({
                htmlMessage: `
                        <p>Duplicate ChinesePod Stripe Subscription Created https://www.chinesepod.com</p>
                        <br />
                        <p>Name: ${inputs.data.fName} ${inputs.data.lName}</p>
                        <p>Email: ${inputs.data.emailAddress}</p>
                        <br />
                        ${inputs.data.promoCode ? `<p>Code: ${inputs.data.promoCode}</p>` : ''}
                        <p>Product: ${inputs.data.plan} - ${inputs.data.billingCycle}</p>
                        <p>Existing Subscription:</p>
                        <p>Subscription ID: ${subscription.subscription_id}</p>
                        <br />
                        <p>Cheers,</p>
                        <p>The Friendly ChinesePod Contact Robot</p>
                        `,
                to: 'followup@chinesepod.com',
                subject: 'Duplicate ChinesePod Subscriptions',
                from: 'subscriptions@chinesepod.com',
                fromName: 'ChinesePod Subscriptions'
              });
            });
        } else {
          await sails.helpers.mailgun.sendHtmlEmail.with({
            htmlMessage: `
                        <p>Duplicate ChinesePod Subscription Created https://www.chinesepod.com</p>
                        <br />
                        <p>Name: ${inputs.data.fName} ${inputs.data.lName}</p>
                        <p>Email: ${inputs.data.emailAddress}</p>
                        <br />
                        ${inputs.data.promoCode ? `<p>Code: ${inputs.data.promoCode}</p>` : ''}
                        <p>Product: ${inputs.data.plan} - ${inputs.data.billingCycle}</p>
                        <p>Existing Subscriptions:</p>
                        <p>Subscription ID: ${subscription.data.subscription_id}</p>
                        <br />
                        <p>Cheers,</p>
                        <p>The Friendly ChinesePod Contact Robot</p>
                        `,
            to: 'followup@chinesepod.com',
            subject: 'Duplicate ChinesePod Subscriptions',
            from: 'subscriptions@chinesepod.com',
            fromName: 'ChinesePod Subscriptions'
          });
        }
      });

    }

    // Update User Access on UserSiteLinks
    let moment = require('moment');
    let expiry = moment(new Date()).add(transaction.product_length, 'months').toDate();
    await UserSiteLinks.updateOne({user_id:inputs.userId, site_id: 2})
      .set({
        usertype_id: plans[inputs.data.plan].id,
        expiry: expiry
      });

    //TODO REMOVE THIS FOR GIFT SUBSCRIPTIONS
    // Update User SessionInfo to Match Current Access Level
    const phpSession = await sails.helpers.php.updateSession.with({
      userId: inputs.userId,
      planName: inputs.data.plan,
      planId: plans[inputs.data.plan].id
    });

    let productName = `${inputs.data.trial ? 'Trial ' : ''}${_.capitalize(inputs.data.plan)} Subscription ${transaction.product_length} Months`;

    this.req.visitor
      .event('payment', 'payment')
      .transaction(transaction.id, transaction.billed_amount)
      .item(transaction.billed_amount, 1, transaction.product_id, productName)
      .send();

    if (inputs.data.trial) {
      await User.updateOne({id: inputs.userId})
        .set({trial: new Date(Date.now()).toISOString()});
    }

    return {
      success: 1,
      amount: paymentData.amount,
      currency: paymentData.currency
    }
  }


};
