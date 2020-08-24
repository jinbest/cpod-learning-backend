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

    if (inputs.code.length < 8) {
      if (this.req.wantsJSON) {
        throw 'invalid'
      } else {
        return this.res.redirect('/redeem');
      }
    } else {
      let originalCode = inputs.code;
      originalCode = originalCode.split('-').join('');
      sails.log.info(originalCode);
      inputs.code = '';
      for (let step = 0; step < originalCode.length; step++) {
        if (step !==0 && step % 4 === 0) {
          inputs.code += '-';
        }
        inputs.code += originalCode[step];
      }
      sails.log.info(inputs.code);
    }

    let action = await AccessVoucherCodes.findOne({code: inputs.code, status: 'created'});

    if (!action){
      if (this.req.wantsJSON) {
        throw 'invalid'
      } else {
        return this.res.redirect('/redeem');
      }
    }

    if (action.expiry && new Date(action.expiry) < new Date()) {
      if (this.req.wantsJSON) {
        throw 'invalid'
      } else {
        return this.res.redirect('/redeem');
      }
    }

    sails.log.info(action);

    if (!action.access_type) {
      if (this.req.wantsJSON) {
        throw 'invalid'
      } else {
        return this.res.redirect('/redeem');
      }
    }

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    await UserSiteLinks.update({user_id: inputs.userId, site_id: 2})
      .set({
        usertype_id: action.access_type === 'premium' ? 5 : 6,
        expiry: new Date(Date.now() + action.accessLength * 24 * 60 * 60 * 1000),
        signup_user_agent: this.req.headers['user-agent']
      });

    await AccessVoucherCodes.updateOne({id: action.id})
      .set({
        status: 'used',
        redeemed_by: inputs.userId
      });

    if (!this.req.wantsJSON) {
      return this.res.redirect('/home')
    }
  }


};
