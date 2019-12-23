module.exports = {


  friendlyName: 'Checkout',


  description: 'Checkout something.',


  inputs: {
    plan: {
      type: 'string',
      required: true
    },
    billingCycle: {
      type: 'string',
      required: true
    },
    emailAddress: {
      type: 'string'
    },
    userId: {
      type: 'number'
    },
    fName: {
      type: 'string',
      required: true
    },
    lName: {
      type: 'string',
      required: true
    },
    address1: {
      type: 'string'
    },
    address2: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    country: {
      type: 'string'
    },
    state: {
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

    if (inputs === {}) {
      throw {invalid: 'No Data Submitted'}
    }

    sails.log.info(inputs);

    let ipData = {};

    if (!this.req.me) {

      // Create a new User
      const email = inputs.emailAddress.toLowerCase();
      const IPData = require('ipdata').default;
      const ipdata = new IPData( sails.config.custom.ipDataKey);
      // const axios = require('axios');
      // const ua = require('universal-analytics');

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
        sails.log.info(userTrial);
        if (userTrial.trial) {
          delete this.req.session.trial;
          await sails.helpers.mailgun.sendHtmlEmail.with({
            htmlMessage: `
            <p>Failed to Start a Free Trial on https://www.chinesepod.com</p>
            <br />
            <p>Name: ${inputs.fName} ${inputs.lName}</p>
            <p>Email: ${inputs.emailAddress}</p>
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

    let errors = [];

    let cardData = {};

    let customerData = await sails.helpers.stripe.createOrUpdateCustomer.with({
      userId: inputs.userId,
      emailAddress: inputs.emailAddress.toLowerCase(),
      fullName: `${inputs.fName} ${inputs.lName}`,
      token: inputs.token
    });


    if (!customerData || customerData.err) {
      //TODO STORE THIS SOMEWHERE
      sails.log.error(customerData.err);
      await sails.helpers.mailgun.sendHtmlEmail.with({
        htmlMessage: `
            <p>Failed User Payment on https://www.chinesepod.com</p>
            <br />
            <p>Name: ${inputs.fName} ${inputs.lName}</p>
            <p>Email: ${inputs.emailAddress}</p>
            <br />
            <p>Error: ${customerData.err ? customerData.err : 'Could not confirm the payment method. Please try again later.'}</p>
            <br />
            <p>Cheers,</p>
            <p>The Friendly ChinesePod Contact Robot</p>
            `,
        to: 'followup@chinesepod.com',
        subject: 'Failed User Payment',
        from: 'errors@chinesepod.com',
        fromName: 'ChinesePod Errors'
      });
      throw {declined: customerData.err ? customerData.err : 'Could not confirm the payment method. Please try again later.'};
    }

    let coupon = {}; let discount = 0.00;

    if (inputs.promoCode) {
      let response = await sails.helpers.promo.checkCode(inputs.promoCode, plans[inputs.plan][inputs.billingCycle].id);

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
            await sails.helpers.mailgun.sendHtmlEmail.with({
              htmlMessage: `
            <p>Failed User Payment on https://www.chinesepod.com</p>
            <br />
            <p>Name: ${inputs.fName} ${inputs.lName}</p>
            <p>Email: ${inputs.emailAddress}</p>
            <br />
            <p>Code: ${inputs.promoCode}</p>
            <p>Product: ${inputs.plan} - ${inputs.billingCycle}</p>
            <p>Error: Invalid promotional code</p>
            <br />
            <p>Cheers,</p>
            <p>The Friendly ChinesePod Contact Robot</p>
            `,
              to: 'followup@chinesepod.com',
              subject: 'Failed User Payment',
              from: 'errors@chinesepod.com',
              fromName: 'ChinesePod Errors'
            });
            throw {declined: 'Invalid promotional code'}
        }
      } else {
        await sails.helpers.mailgun.sendHtmlEmail.with({
          htmlMessage: `
            <p>Failed to Apply User Promo Code on https://www.chinesepod.com</p>
            <br />
            <p>Name: ${inputs.fName} ${inputs.lName}</p>
            <p>Email: ${inputs.emailAddress}</p>
            <br />
            <p>Code: ${inputs.promoCode}</p>
            <p>Product: ${inputs.plan} - ${inputs.billingCycle}</p>
            <p>Error: Invalid promotional code</p>
            <br />
            <p>Cheers,</p>
            <p>The Friendly ChinesePod Contact Robot</p>
            `,
          to: 'followup@chinesepod.com',
          subject: 'Failed Promo Code',
          from: 'errors@chinesepod.com',
          fromName: 'ChinesePod Errors'
        });
        throw {declined: 'Invalid promotional code'}
      }
    }

    let holidayPromo = false;
    if (inputs.plan === 'holiday') {
      holidayPromo = true;

      await new Promise ((resolve, reject) => {
        stripe.charges.create({
            amount: plans[inputs.plan][inputs.billingCycle].setupFee * 100,
            currency: 'usd',
            customer: customerData.id,
            description: 'ChinesePod Holiday Promotion'
          },
          function(err, charge) {
          if (err) {
            reject(err)
          }
          resolve(charge);
        })
      })
    }

    await stripe.subscriptions.create({
      customer: customerData.id,
      items: [{plan: plans[inputs.plan][inputs.billingCycle].stripeId}],
      trial_period_days: holidayPromo ? 90 : inputs.trial ? 14 : 0, // Holiday Promo or 2 week trial or No trial
      coupon: coupon ? coupon.id : null
    })
      .then(async (subscription) => {

        sails.log.info(subscription);

        // If Trial - Mark User Record as Such
        if (inputs.trial) {
          userData = await User.updateOne({id: inputs.userId})
            .set({trial: new Date(Date.now()).toISOString()});
        }
        try {
          cardData = customerData.sources.data[0];
        } catch (e) {
          sails.log.error(e);

          sails.hooks.bugsnag.notify(e);
        }

        const existingSubscriptions = await Subscriptions.find({
          user_id: inputs.userId,
          status: 1,
          next_billing_time: {
            '>=': new Date()
          }
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

        let stripeSubscription = {};

        try {
          stripeSubscription = await stripe.invoices.retrieve(subscription.latest_invoice);
        } catch (e) {
          sails.log.error(e);
          sails.hooks.bugsnag.notify(e);
        }

        let transaction = await Transactions.create({
          subscription_id: subscription.id,
          transaction_id: stripeSubscription && stripeSubscription.charge ? stripeSubscription.charge : '',
          user_id: inputs.userId,
          product_id: plans[inputs.plan][inputs.billingCycle].id,
          product_length: plans[inputs.plan][inputs.billingCycle].length,
          product_price: plans[inputs.plan][inputs.billingCycle].price,
          discount: discount ? discount : 0.00,
          billed_amount: holidayPromo ? plans[inputs.plan][inputs.billingCycle].setupFee : inputs.trial ? 0.00 : plans[inputs.plan][inputs.billingCycle].price - discount,
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
        }).fetch();

        sails.log.info(transaction);

        if (inputs.address1 && inputs.country && inputs.city) {
          await TransactionAddresses.create({
            transaction_id: transaction.id,
            city: inputs.city,
            country: inputs.country,
            state: inputs.state,
            zip_code: inputs.zip,
            full_name: `${inputs.fName} ${inputs.lName}`,
            address1: inputs.address1,
            address2: inputs.address2 ? inputs.address2 : '',
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
                        <p>Name: ${inputs.fName} ${inputs.lName}</p>
                        <p>Email: ${inputs.emailAddress}</p>
                        <br />
                        ${inputs.promoCode ? `<p>Code: ${inputs.promoCode}</p>` : ''}
                        <p>Product: ${inputs.plan} - ${inputs.billingCycle}</p>
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
                        <p>Name: ${inputs.fName} ${inputs.lName}</p>
                        <p>Email: ${inputs.emailAddress}</p>
                        <br />
                        ${inputs.promoCode ? `<p>Code: ${inputs.promoCode}</p>` : ''}
                        <p>Product: ${inputs.plan} - ${inputs.billingCycle}</p>
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
                        <p>Name: ${inputs.fName} ${inputs.lName}</p>
                        <p>Email: ${inputs.emailAddress}</p>
                        <br />
                        ${inputs.promoCode ? `<p>Code: ${inputs.promoCode}</p>` : ''}
                        <p>Product: ${inputs.plan} - ${inputs.billingCycle}</p>
                        <p>Existing Subscriptions:</p>
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
            }
          });
        }

// Update User Access on UserSiteLinks
        let userSiteLinks = await UserSiteLinks.updateOne({user_id:inputs.userId, site_id: 2})
          .set({
            usertype_id: plans[inputs.plan].id,
            expiry: new Date(subscription['current_period_end'] * 1000).toISOString()
          });

// Update User SessionInfo to Match Current Access Level
        const phpSession = await sails.helpers.php.updateSession.with({
          userId: inputs.userId,
          planName: inputs.plan,
          planId: plans[inputs.plan].id
        });


        let productName = `${inputs.trial ? 'Trial ' : ''}${_.capitalize(inputs.plan)} Subscription ${transaction.product_length} Months`;

        if (holidayPromo) {
          productName = plans['holiday'].description;
        }

        this.req.visitor
          .event('payment', 'payment')
          .transaction(transaction.id, transaction.billed_amount)
          .item(transaction.billed_amount, 1, transaction.product_id, productName, {ti:  transaction.id})
          .send();

        this.res.cookie('CPODSESSID', phpSession, {
          domain: '.chinesepod.com',
          expires: new Date(Date.now() + 365.25 * 24 * 60 * 60 * 1000)
        });
        exits.success();
      })
      .catch(async(err) => {
        sails.log.error(err);

        await sails.helpers.mailgun.sendHtmlEmail.with({
          htmlMessage: `
            <p>Failed User Purchase on https://www.chinesepod.com</p>
            <br />
            <p>Name: ${inputs.fName} ${inputs.lName}</p>
            <p>Email: ${inputs.emailAddress}</p>
            <br />
            ${inputs.promoCode ? `<p>Code: ${inputs.promoCode}</p>` : ''}
            <p>Product: ${inputs.plan} - ${inputs.billingCycle}</p>
            <p>Error: ${err}</p>
            <br />
            <p>Cheers,</p>
            <p>The Friendly ChinesePod Contact Robot</p>
            `,
          to: 'followup@chinesepod.com',
          subject: 'Failed User Purchase',
          from: 'errors@chinesepod.com',
          fromName: 'ChinesePod Errors'
        });

        errors.push(err.message);
        throw {declined: errors.length > 0 ? errors[0] : 'Could not confirm the payment method. Please try again later.'};
      })
  }
};
