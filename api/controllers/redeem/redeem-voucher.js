/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'Redeem voucher code',


  description: '',


  inputs: {
    code: {
      type: 'string',
      required: true
    }

  },


  exits: {
    invalid: {
      description: `The provided voucher code is invalid.`,
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {

    const plans = [
      {
        id: 2,
        stripeId: 'Monthly Plan -2',
        length: 1,
        price: 29.00,
        level: 'premium',
        levelId: 5
      },
      {
        id: 18,
        stripeId: 'Quarterly Plan -18',
        length: 3,
        price: 79.00,
        level: 'premium',
        levelId: 5
      },
      {
        id: 140,
        stripeId: 'Annual Plan -140',
        length: 12,
        price: 249.00,
        level: 'premium',
        levelId: 5
      },
      {
        id: 13,
        stripeId: 'Monthly Plan -13',
        length: 1,
        price: 14.00,
        level: 'basic',
        levelId: 6
      },
      {
        id: 142,
        stripeId: 'Annual Plan -142',
        length: 12,
        price: 124.00,
        level: 'basic',
        levelId: 6
      },
      {
        id: 14,
        stripeId: 'Quarterly Plan -14',
        length: 3,
        price: 39.00,
        level: 'basic',
        levelId: 6
      }
    ];

    sails.log.info('step 1');

    if (inputs.code.length < 8 || !this.req.session.userId) {
      if (this.req.wantsJSON) {
        throw 'invalid'
      } else {
        return this.res.redirect('/redeem');
      }
    }

    inputs.userId = this.req.session.userId;

    sails.log.info('step 2');

    let action = await Vouchers.findOne({voucher_code: inputs.code, code_status: 1, expiry_date: {'>=': new Date()}});

    if (!action){
      if (this.req.wantsJSON) {
        throw 'invalid'
      } else {
        return this.res.redirect('/redeem');
      }
    }

    sails.log.info('step 3');


    sails.log.info('success with: ' + inputs.code);

    try {

      let plan = (plans.filter(i => i.id === action.product_id))[0];

      let moment = require('moment');

      let expiry = moment(new Date()).add(plan['length'], 'months').toDate();

      sails.log.info({plan: plan, expiry: expiry});

      await UserSiteLinks.update({user_id: inputs.userId, site_id: 2})
        .set({
          usertype_id: plan.levelId,
          expiry: expiry
        });

      await Vouchers.updateOne({id: action.id})
        .set({
          code_status: 0,
          redeemed_by: inputs.userId
        });

      return this.res.view('/redeem-success');

    } catch (e) {

      sails.log.error(e);

      if (this.req.wantsJSON) {

        throw 'invalid'

      } else {
        return this.res.redirect('/redeem');

      }
    }







  }


};
