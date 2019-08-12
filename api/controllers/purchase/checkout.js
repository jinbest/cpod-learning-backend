module.exports = {


  friendlyName: 'Checkout',


  description: 'Checkout something.',


  inputs: {
    plan: {
      type: 'string'
    },
    billingCycle: {
      type: 'string'
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
    zip: {
      type: 'string'
    },
    token: {
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


  fn: async function (inputs, exits) {

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
        }
      },
      class: {
        //Nothing Yet
      }
    };

    if (inputs === {}) {
      throw {invalid: 'No Data Submitted'}
    }

    sails.log.info({newCheckout: inputs});

    let ipData = {};

    if (!this.req.me) {

      // Create a new User
      const email = inputs.emailAddress.toLowerCase();
      const ipdata =  require('ipdata');
      // const axios = require('axios');
      // const ua = require('universal-analytics');

      let password = await sails.helpers.passwordGenerate();

      if(this.req.ip && this.req.ip !== '::1') {
        await ipdata.lookup(this.req.ip, sails.config.custom.ipDataKey)
          .then((info) => {
            ipData = info;
          })
          .catch((err) => {
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
        sails.log.info(userTrial);
        if (userTrial.trial) {
          throw {declined: `Unfortunately, you can only enroll in a trial subscription once. 
        It was already redeemed on ${new Date(userTrial.trial.toString()).toLocaleString()}`};
        }
      }
    }

    let errors = [];

    sails.log.info({userId: inputs.userId});

    let cardData = {};

    let customerData = await sails.helpers.stripe.createOrUpdateCustomer.with({
      userId: inputs.userId,
      emailAddress: inputs.emailAddress.toLowerCase(),
      fullName: `${inputs.fName} ${inputs.lName}`,
      token: inputs.token
    });


    sails.log.info({customerData: customerData});

    if (!customerData || customerData.err) {
      //TODO STORE THIS SOMEWHERE
      throw {declined: customerData.err ? customerData.err : 'Could not confirm the payment method. Please try again later.'};
    }

    let coupon = {}; let discount = 0.00;

    if (inputs.promoCode) {
      let response = await sails.helpers.promo.checkCode(inputs.promoCode, plans[inputs.plan][inputs.billingCycle].id);
      sails.log.info({response: response});
      if (response.success && response.data) {
        switch (response.data.type) {
          case 0:
            discount = (parseFloat(response.data.value) / 100) * plans[inputs.plan][inputs.billingCycle].price;
            coupon = await stripe.coupons.create({
              percent_off: parseFloat(response.data.value),
              duration: 'once'
            });
            break;
          case 1:
            discount = parseFloat(response.data.value);
            coupon = await stripe.coupons.create({
              amount_off: parseFloat(response.data.value) * 100, // Integer to the cent
              currency: 'USD',
              duration: 'once'
            });
            break;
          case 2:
            //TODO ADDING THIS FOR FUTURE USES - MIGRATE STUDENT SUBSCRIPTION TO THIS
            coupon = await stripe.coupons.create({
              amount_off: parseFloat(response.data.value),
              duration: 'repeating'
            });
            break;
          default:
            throw {declined: 'Invalid promotional code'}
        }
        sails.log.info(coupon);
      } else {
        throw {declined: 'Invalid promotional code'}
      }
    }

    await stripe.subscriptions.create({
      customer: customerData.id,
      items: [{plan: plans[inputs.plan][inputs.billingCycle].stripeId}],
      trial_period_days: inputs.trial ? 14 : 0, // 2 weeks or No trial
      coupon: coupon ? coupon.id : null
    })
      .then(async (subscription) => {
        sails.log.info({
          customer: customerData.id,
          items: [{plan: plans[inputs.plan][inputs.billingCycle].stripeId}],
          trial_period_days: inputs.trial ? 14 : 0, // 2 weeks or No trial
          coupon: coupon ? coupon.id : null
        });
        sails.log.info({subscription: subscription});

        // If Trial - Mark User Record as Such
        if (inputs.trial) {
          userData = await User.updateOne({id: inputs.userId})
            .set({trial: new Date(Date.now()).toISOString()});
          sails.log.info(userData);
        }
        try {
          cardData = customerData.sources.data[0];
        } catch (e) {
          sails.log.error(e);
        }
        sails.log.info({
          cc_num: cardData ? cardData['last4'] : '9999',
          cc_exp: cardData ? `${cardData['exp_month']}/${cardData['exp_year']}` : '99/99',
        });

        // Check Subscriptions Table
        const cpodSubscription = await Subscriptions.create({
          user_id: inputs.userId,
          subscription_id: subscription.id,
          subscription_from: 7, // Stripe = 7
          subscription_type: plans[inputs.plan].type, // converted 'plan'
          product_id: plans[inputs.plan][inputs.billingCycle].id, // Product ID
          product_length: plans[inputs.plan][inputs.billingCycle].length, // converted 'billingCycle'
          status: 1, //  1=active, 2=cancelled, 3=past due
          next_billing_time: new Date(subscription['current_period_end'] * 1000).toISOString(),
          cc_num: cardData ? cardData.last4 : '9999',
          cc_exp: cardData ? `${cardData.exp_month}/${cardData.exp_year}` : '99/99',
        }).fetch();

//TODO Check Payments Table

        if (!ipData['country_name']) {
          const ipdata = require('ipdata');

          if(this.req.ip && this.req.ip !== '::1') {
            await ipdata.lookup(this.req.ip, sails.config.custom.ipDataKey)
              .then((info) => {
                ipData = info;
              })
              .catch((err) => {
                sails.log.error(err);
              });
          }
        }

        await Transactions.create({
          subscription_id: subscription.id,
          user_id: inputs.userId,
          product_id: plans[inputs.plan][inputs.billingCycle].id,
          product_length: plans[inputs.plan][inputs.billingCycle].length,
          product_price: plans[inputs.plan][inputs.billingCycle].price,
          discount: discount ? discount : 0.00,
          billed_amount: inputs.trial ? 0.00 : plans[inputs.plan][inputs.billingCycle].price - discount,
          promotion_code: inputs.promoCode ? inputs.promoCode : null,
          pay_status: 2,
          pay_method: 9,
          notes: 'CPOD JS PAGE',
          region: ipData['region'] ? ipData['region'] : null,
          country: ipData['country_name'] ? ipData['country_name'] : null,
          city: ipData['city'] ? ipData['city'] : null,
          ip_address: this.req.ip,
          created_by: inputs.userId,
          modified_by: inputs.userId,
        });



// Update User Access on UserSiteLinks
        const userSiteLinks = UserSiteLinks.updateOne({user_id:inputs.userId})
          .set({usertype_id: plans[inputs.plan].id});

// Update User SessionInfo to Match Current Access Level
        const phpSession = await sails.helpers.php.updateSession.with({
          userId: inputs.userId,
          planName: inputs.plan,
          planId: plans[inputs.plan].id
        });

        sails.log.info(phpSession);

        this.res.cookie('CPODSESSID', phpSession, {
          domain: '.chinesepod.com',
          expires: new Date(Date.now() + 365.25 * 24 * 60 * 60 * 1000)
        });
        exits.success();
      })
      .catch((err) => {
        //TODO STORE THIS SOMEWHERE
        sails.log.info(err.message);
        errors.push(err.message);
        throw {declined: errors.length > 0 ? errors[0] : 'Could not confirm the payment method. Please try again later.'};
      })
  }
};
