module.exports = {


  friendlyName: 'Update billing card',


  description: 'Update the credit card for the logged-in user.',


  inputs: {

    stripeToken: {
      type: 'string',
      example: 'tok_199k3qEXw14QdSnRwmsK99MH',
      description: 'The single-use Stripe Checkout token identifier representing the user\'s payment source (i.e. credit card.)',
      extendedDescription: 'Omit this (or use "") to remove this user\'s payment source.',
      whereToGet: {
        description: 'This Stripe.js token is provided to the front-end (client-side) code after completing a Stripe Checkout or Stripe Elements flow.'
      }
    },

    billingCardLast4: {
      type: 'string',
      example: '4242',
      description: 'Omit if removing card info.',
      whereToGet: { description: 'Credit card info is provided by Stripe after completing the checkout flow.' }
    },

    billingCardBrand: {
      type: 'string',
      example: 'visa',
      description: 'Omit if removing card info.',
      whereToGet: { description: 'Credit card info is provided by Stripe after completing the checkout flow.' }
    },

    billingCardExpMonth: {
      type: 'string',
      example: '08',
      description: 'Omit if removing card info.',
      whereToGet: { description: 'Credit card info is provided by Stripe after completing the checkout flow.' }
    },

    billingCardExpYear: {
      type: 'string',
      example: '2023',
      description: 'Omit if removing card info.',
      whereToGet: { description: 'Credit card info is provided by Stripe after completing the checkout flow.' }
    },

    subscriptionId: {
      type: 'string',
      required: true
    },
    fullName: {
      type: 'string',
      required: true
    }

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userData = await User.findOne({id: inputs.userId});

    let customerData = await sails.helpers.stripe.updateCustomer.with({
      userId: inputs.userId,
      emailAddress: userData.email,
      fullName: inputs.fullName,
      token: inputs.stripeToken
    });

    sails.log.info(customerData);

    let cardData;

    try {
      cardData = customerData.sources.data[0];
    } catch (e) {
      sails.log.error(e);
      sails.hooks.bugsnag.notify(e);
    }

    // Check Subscriptions Table
    await Subscriptions.updateOne({subscription_id: inputs.subscriptionId}).set({
      cc_num: cardData ? cardData.last4 : '9999',
      cc_exp: cardData ? `${cardData.exp_month}/${cardData.exp_year}` : '99/99',
    });

  }


};
