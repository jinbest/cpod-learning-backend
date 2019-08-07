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
        },
        quarterly: {
          id: 18,
          stripeId: 'Quarterly Plan -18',
          length: 3,
        },
        annually: {
          id: 140,
          stripeId: 'Annual Plan -140',
          length: 12,
        },
        monthlyTrial: {
          id: 271,
          stripeId: 'Monthly Plan -271',
          length: 1
        }
      },
      basic: {
        id: 6,
        type: 1,
        monthly: {
          id: 13,
          stripeId: 'Monthly Plan -13',
          length: 1,
        },
        quarterly: {
          id: 14,
          stripeId: 'Quarterly Plan -14',
          length: 3,
        },
        annually: {
          id: 142,
          stripeId: 'Annual Plan -142',
          length: 12,
        }
      },
      class: {
        //Nothing Yet
      }
    };
    //TODO REMOVE THIS TESTING SET
    inputs.userId = '1016995';

    if (!inputs.userId) {
      try {
        inputs.userId = this.req.session.userId;
        sails.log.info(this.req.session.userId);
      } catch (e) {
        sails.log.error(e);
        throw 'invalid';
      }
    }

    sails.log.info(inputs);

    if (inputs === {}) {
      throw 'invalid'
    }

    let customer = '';

    let errors = [];

    // Check if User has Used a Trial before
    if (inputs.trial) {
      let userTrial = await User.findOne({id: inputs.userId});
      sails.log.info(userTrial);
      if (userTrial.trial) {
        throw {declined: `Unfortunately, you can only enroll in a trial subscription once. 
        It was already redeemed on ${new Date(userTrial.trial.toString()).toLocaleString()}`};
      }
    }


    await stripe.customers.update(
      `${inputs.userId}`, {
        source: inputs.token,
        name: `${inputs.fName} ${inputs.lName}`
      },
      function (err, user) {
        if (err) {
          switch (err.type) {
            case 'StripeCardError':
              // A declined card error
              errors.push(err.message); // => e.g. "Your card's expiration year is invalid."
              break;
            case 'StripeRateLimitError':
              // Too many requests made to the API too quickly
              break;
            case 'StripeInvalidRequestError':
              // Invalid parameters were supplied to Stripe's API
              break;
            case 'StripeAPIError':
              // An error occurred internally with Stripe's API
              break;
            case 'StripeConnectionError':
              // Some kind of error occurred during the HTTPS communication
              break;
            case 'StripeAuthenticationError':
              // You probably used an incorrect API key
              break;
            default:
              // Handle any other types of unexpected errors
              break;
          }
        } else {
          customer = user;
        }
      });

    //Customer Does not exist - Create One
    if (!customer) {
      await stripe.customers.create({
        id: inputs.userId,
        email: inputs.emailAddress,
        source: inputs.token,
        name: `${inputs.fName} ${inputs.lName}`
      }, function (err, user) {
        if (err) {
          switch (err.type) {
            case 'StripeCardError':
              // A declined card error
              errors.push(err.message); // => e.g. "Your card's expiration year is invalid."
              break;
            case 'StripeRateLimitError':
              // Too many requests made to the API too quickly
              break;
            case 'StripeInvalidRequestError':
              // Invalid parameters were supplied to Stripe's API
              break;
            case 'StripeAPIError':
              // An error occurred internally with Stripe's API
              break;
            case 'StripeConnectionError':
              // Some kind of error occurred during the HTTPS communication
              break;
            case 'StripeAuthenticationError':
              // You probably used an incorrect API key
              break;
            default:
              // Handle any other types of unexpected errors
              break;
          }
        } else {
          customer = user;
        }
      });
    }

    if (errors.length > 0) {
      sails.log.error(errors);
      throw {declined: errors[0]};
    }

    if (!customer) {
      throw 'invalid';
    }

    const cardData = customer.sources.data[0];

    try {
      sails.log.info(customer.sources.data)
    } catch (e) {
      sails.log.error(e)
    }


    // Subscribe Customer to a Plan
    let subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{plan: plans[inputs.plan][inputs.billingCycle].stripeId}],
      trial_period_days: inputs.trial ? 14 : 0 // No trial
    }).catch((err) => {
      sails.log.info(err);
      errors.push(err.message);
    });

    sails.log.info(errors);

    if (errors.length > 0) {
      sails.log.error(errors);
      throw {declined: errors[0]};
    }

    sails.log.info(subscription);

    if (!subscription) {
      throw 'invalid';
    }

    // If Trial - Mark User Record as Such
    if (inputs.trial) {
      userData = await User.updateOne({id: inputs.userId})
        .set({trial: new Date(Date.now()).toISOString()});
      sails.log.info(userData);
    }

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
      cc_num: cardData ? cardData.last4 : '',
      cc_exp: cardData ? `${cardData.exp_month}/${cardData.exp_year}` : '',
    }).fetch();

    //TODO Check Payments Table



    //TODO Update User Access on UserSiteLinks
    const userSiteLinks = UserSiteLinks.updateOne({user_id:inputs.userId})
      .set({usertype_id: plans[inputs.plan].id});

    //TODO Update User SessionInfo to Match Current Access Level
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
  }
};
