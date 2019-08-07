module.exports = {


  friendlyName: 'Check promo',


  description: 'Check the validity of a ChinesePod Promo Code',

  inputs: {
    promoCode: {
      type: 'string',
      description: 'A promo code issued by ChinesePod.',
      required: true
    },
    plan: {
      type: 'string',
      required: true
    },
    billingCycle: {
      type: 'string',
      required: true
    }
  },


  exits: {

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

    let response = await sails.helpers.promo.checkCode.with({
      promoCode: inputs.promoCode,
      productId: plans[inputs.plan][inputs.billingCycle].id
    });
    if (response.success) {
      return {
        success: true,
        discount: {
          type: response.data.type,
          value: response.data.value,
          plan: inputs.plan,
          billingCycle: inputs.billingCycle
        }
      }
    } else {
      sails.log.info(response.data);
      return {
        error: response.error,
        data: response.data ? response.data : false
      }
    }
  }



};
