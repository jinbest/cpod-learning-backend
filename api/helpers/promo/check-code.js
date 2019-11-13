module.exports = {


  friendlyName: 'Check code',


  description: '',


  inputs: {
    promoCode: {
      type: 'string',
      required: true
    },
    productId: {
      type: 'number',
      required: true
    },
  },


  exits: {

    success: {
      description: 'Valid code',
    },
    expired: {
      description: 'Code has expired'
    },
    wrongProduct: {
      description: 'Valid Code - Invalid Product'
    },
    invalid: {
      description: 'Invalid Code'
    }

  },


  fn: async function (inputs) {
    // TODO

    sails.log.info(
      {codeInputs: {
          promotion_code: inputs.promoCode,
          product_id: inputs.productId
        }
      });
    let promo = await PromoCodes.findOne({
      where: {
        promotion_code: inputs.promoCode,
        product_id: inputs.productId
      }
    });
    if (promo) {
      if (new Date(promo.expiry_date) > new Date() && promo.max_uses > promo.times_used) {
        sails.log.info({promoWorked: promo});
        return {
          success: true,
          data: promo
        }
      } else {
        sails.log.info({expired: promo});
        return {
          error: 'Code has expired',
        }
      }

    } else {
      promo = await PromoCodes.find({
        where: {
          promotion_code: inputs.promoCode,
          expiry_date: {
            '>=': new Date()
          }
        },
        select: ['product_id']
      });
    }

    if (promo && promo.length > 0) {
      return {
        error: 'Valid Code - Wrong Product',
        data: promo
      }
    } else {
      return {
        error: 'Invalid Code'
      }
    }
  }
};

