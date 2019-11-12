module.exports = {


  friendlyName: 'Create',


  description: 'Create Paypal Subscription.',


  inputs: {
    plan: {
      type: 'string',
      require: true
    },
    billingCycle: {
      type: 'string',
      require: true
    },
    emailAddress: {
      type: 'string'
    },
    userId: {
      type: 'number'
    },
    fName: {
      type: 'string'
    },
    lName: {
      type: 'string'
    },
    trial: {
      type: 'boolean'
    },
    promoCode: {
      type: 'string'
    }
  },

  exits: {
    success: {
      description: 'Subscription Created'
    },
    invalid: {
      responseType: 'badRequest',
      description: 'The provided email address is invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request ' +
        'parameters should have been validated/coerced _before_ they were sent.'
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
        }
      },
      class: {
        //Nothing Yet
      }
    };


    const moment = require('moment');


    let ipData = {};

    let userData = {};

    if (!this.req.me) {

      // Create a new User
      const email = inputs.emailAddress.toLowerCase();
      const ipdata =  require('ipdata');

      let password = await sails.helpers.passwordGenerate();

      if(this.req.ip && this.req.ip !== '::1') {
        await ipdata.lookup(this.req.ip, sails.config.custom.ipDataKey)
          .then((info) => {
            ipData = info;
          })
          .catch((err) => {
            sails.hooks.bugsnag.notify(err);
            sails.log.error(err);
          });
      }

      let name = `${inputs.fName} ${inputs.lName}`;
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
      }, inputs.optIn ? {
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
        optIn: inputs.optIn,
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
      if (inputs.trial) {
        let userTrial = await User.findOne({id: inputs.userId});
        if (userTrial.trial) {
          throw {declined: `Unfortunately, you can only enroll in a trial subscription once. 
        It was already redeemed on ${new Date(userTrial.trial.toString()).toLocaleString()}`};
        }
      }
    }

    let errors = [];

    let coupon = {}; let discount = 0.00;

    if (inputs.promoCode) {
      let response = await sails.helpers.promo.checkCode(inputs.promoCode, plans[inputs.plan][inputs.billingCycle].id);

      if (response.success && response.data) {
        switch (response.data.type) {
          case 0:
            discount = (parseFloat(response.data.value) / 100) * plans[inputs.plan][inputs.billingCycle].price;
            coupon = '';
            break;
          case 1:
            discount = parseFloat(response.data.value);
            coupon = '';
            break;
          case 2:
            coupon = '';
            break;
          default:
            throw {declined: 'Invalid promotional code'}
        }
      } else {
        throw {declined: 'Invalid promotional code'}
      }
    }

//Atributes for creating the billing plan of  a user.
    let billingPlanAttributes = {
      "description": `ChinesePod ${_.capitalize(inputs.plan)} Subscription`,
      "merchant_preferences": {
        "auto_bill_amount": "yes",
        "cancel_url": sails.config.custom.baseUrl + "/api/v1/paypal/cancel",
        "initial_fail_amount_action": "cancel",
        "max_fail_attempts": "2",
        "return_url": sails.config.custom.baseUrl + "/api/v1/paypal/success",
        "setup_fee": {
          "currency": "USD",
          "value": plans[inputs.plan][inputs.billingCycle]['price'] // Testing setup fees
        }
      },
      "name": "ChinesePod Subscription",
      "payment_definitions": [
        {
          "amount": {
            "currency": "USD",
            "value": plans[inputs.plan][inputs.billingCycle]['price']
          },
          "charge_models": [],
          "cycles": "0",
          "frequency": "MONTH",
          "frequency_interval": plans[inputs.plan][inputs.billingCycle]['length'],
          "name": "ChinesePod Subscription Payments",
          "type": "REGULAR"
        },
      ],
      "type": "INFINITE"
    };

    if (inputs.trial) {
      billingPlanAttributes['payment_definitions'].push({
        "amount": {
          "currency": "USD",
          "value": 0.00
        },
        "charge_models": [],
        "cycles": "1",
        "frequency": "WEEK",
        "frequency_interval": 2,
        "name": "ChinesePod Trial",
        "type": "TRIAL"
      })
    }

//Once a billing plan is created it must be updated with the following attributes.
    let billingPlanUpdateAttributes = [
      {
        "op": "replace",
        "path": "/",
        "value": {
          "state": "ACTIVE"
        }
      }
    ];

//Attributes for creating the billing agreement.
//Start Date should be greater than current time and date.
    let startDate = moment(new Date()).add(10, 'minute').format('gggg-MM-DDTHH:mm:ss')+'Z';
    sails.log.info(startDate);
    let billingAgreementAttributes = {
      "name": "Subscription to ChinesePod LLC",
      "description": "Description of  your payment  agreement",
      "start_date": startDate,
      "plan": {
        "id": ""
      },
      "payer": {
        "payment_method": "paypal"
      }
    };

    let redirectUrl = '';
    let userToken = '';

    await new Promise((resolve, reject) => {
      PaypalService.createPaymentAgreement(billingPlanAttributes, billingPlanUpdateAttributes, billingAgreementAttributes, (err, result) => {
        if (err) {
          reject(err)
        }
        return resolve(result)
      });
    })
      .then((data) => {
        sails.log.info({paypalData: data});
        redirectUrl = data.approvalUrl;
        userToken = data.token;
      })
      .catch((err) => {
        sails.log.error(err);
        throw {declined: errors.length > 0 ? errors[0] : 'Could not finalize Paypal checkout. Please try again.'};
      });

    // If Trial - Mark User Record as Such
    if (inputs.trial) {
      userData = await User.updateOne({id: inputs.userId})
        .set({trial: new Date(Date.now()).toISOString()});
    }



    if (!ipData['country_name']) {
      const ipdata = require('ipdata');

      if(this.req.ip && this.req.ip !== '::1') {
        await ipdata.lookup(this.req.ip, sails.config.custom.ipDataKey)
          .then((info) => {
            ipData = info;
          })
          .catch((err) => {
            sails.log.error(err);
            sails.hooks.bugsnag.notify(err);
          });
      }
    }

    // Create an interim transaction
    await Transactions.create({
      subscription_id: userToken,
      user_id: inputs.userId,
      product_id: plans[inputs.plan][inputs.billingCycle].id,
      product_length: plans[inputs.plan][inputs.billingCycle].length,
      product_price: plans[inputs.plan][inputs.billingCycle].price,
      discount: discount ? discount : 0.00,
      billed_amount: inputs.trial ? 0.00 : plans[inputs.plan][inputs.billingCycle].price - discount,
      promotion_code: inputs.promoCode ? inputs.promoCode : null,
      pay_status: 1, // Awaiting payment
      pay_method: 10,
      notes: 'CPOD JS PAGE',
      region: ipData['region'] ? ipData['region'] : null,
      country: ipData['country_name'] ? ipData['country_name'] : null,
      city: ipData['city'] ? ipData['city'] : null,
      ip_address: this.req.ip,
      created_by: inputs.userId,
      modified_by: inputs.userId,
    });

    // Create a temporary Subscription entry
    await Subscriptions.create({
      user_id: inputs.userId,
      subscription_id: userToken,
      subscription_from: 2, // Paypal = 2
      subscription_type: plans[inputs.plan].type, // converted 'plan'
      product_id: plans[inputs.plan][inputs.billingCycle].id, // Product ID
      product_length: plans[inputs.plan][inputs.billingCycle].length, // converted 'billingCycle'
      status: 3, //  1=active, 2=cancelled, 3=past due
      next_billing_time: new Date().toISOString(),
      cc_num: 'PPAL',
      cc_exp: 'PPAL'
    }).fetch();


    if (redirectUrl) {
      return {
        success: 1,
        redirect: redirectUrl
      }
    } else {
      throw {declined: errors.length > 0 ? errors[0] : 'Could not finalize Paypal checkout. Please try again.'};
    }

  }


};
