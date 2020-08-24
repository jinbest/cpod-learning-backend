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

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if (inputs.code.length < 8) {
      if (this.req.wantsJSON) {
        throw 'invalid'
      } else {
        return this.res.redirect('/redeem-academic');
      }
    } else {
      let originalCode = inputs.code;
      originalCode = originalCode.split('-').join('');

      inputs.code = '';
      for (let step = 0; step < originalCode.length; step++) {
        if (step !==0 && step % 4 === 0) {
          inputs.code += '-';
        }
        inputs.code += originalCode[step];
      }
      sails.log.info(inputs.code);
    }

    let action = await AccessAcademicCodes.findOne({code: inputs.code, status: 'created', expiry: {'>': new Date()}});

    sails.log.info('Check if Code Exists');
    sails.log.info(action);

    if (!action){
      if (this.req.wantsJSON) {
        throw 'invalid'
      } else {
        return this.res.view('pages/redeem/academic/redeem', {formData: {code: inputs.code}});
      }
    }

    sails.log.info('Check if Code Expired')

    if (new Date(action.expiry) < new Date()) {
      if (this.req.wantsJSON) {
        throw 'invalid'
      } else {
        return this.res.view('pages/redeem/academic/redeem', {formData: {code: inputs.code}});
      }
    }

    sails.log.info('Check for subscriptions')

    // CHECK FOR SUBSCRIPTIONS
    let userSiteLinks = await UserSiteLinks.find({user_id: inputs.userId, site_id: 2})
      .sort('updatedAt DESC')
      .limit(1);

    sails.log.info(userSiteLinks);

    //IF NO CONFLICTS -> APPLY PROMO AND ROUTE TO SUCCESS
    if (!this.req.wantsJSON && userSiteLinks && userSiteLinks.length > 0 && userSiteLinks[0]['usertype_id'] !== 7) {

      return this.res.view('pages/redeem/academic/confirm',{
        formData: {
          code: inputs.code,
          expiry: action.expiry,
          plan: _.capitalize(action.access_type),
          productLength: `PRODUCT LENGTH`
        }
      })

    } else {

      sails.log.info(inputs);
      sails.log.info(action)

      await UserSiteLinks.updateOrCreate({user_id: inputs.userId, site_id: 2},
        {
          user_id: inputs.userId,
          site_id: 2,
          usertype_id: action.access_type === 'premium' ? 5 : 6,
          expiry: new Date(action.expiry),
          signup_user_agent: this.req.headers['user-agent']
        });

      await AccessAcademicCodes.updateOne({id: action.id})
        .set({
          status: 'used',
          redeemed_by: inputs.userId
        });

      if (!this.req.wantsJSON) {
        return this.res.redirect('/home')
      }

    }
  }


};
