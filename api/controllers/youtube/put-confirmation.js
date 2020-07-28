module.exports = {


  friendlyName: 'Put confirmation',


  description: '',


  inputs: {
    id: {
      type: 'number',
      isInteger: true,
      required: true
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {

    const moment = require('moment');

    let userContest = await UserOptions.findOne({id: inputs.id, option_key: 'youtubeContest'});

    if (userContest) { // && userContest.option_value === 'initial'

      await UserOptions.updateOne({id: userContest.id}).set({option_value: 'used'});

      let userData = await User.updateOne({id: userContest.user_id})
        .set({code: await sails.helpers.strings.random('url-friendly')});

      let voucher;
      while (!voucher) {
        voucher = await Vouchers.create({
          voucher_code: await sails.helpers.strings.random('url-friendly').slice(0,10).toUpperCase(),
          product_id: 18,  // 90 Day Premium Plan
          expiry_date: moment().add(30, 'days').toDate(),
        })
          .intercept('E_UNIQUE', () => {sails.hooks.bugsnag.notify('Voucher already exists')})
          .fetch();
      }

      let firstName = await sails.helpers.users.calculateFirstName(userData.id);

      await sails.helpers.sendTemplateEmail.with({
        to: userData.email,
        subject: `Your 90 Day Premium Pass!`,
        template: 'automated/email-gift',
        layout: false,
        toName: userData.name,
        templateData: {
          firstName: firstName ? firstName : 'Learner',
          claimLink: `https://www.chinesepod.com/redeem-gift/${voucher.voucher_code}/${userData.code}`
        }
      });

      return;

    }

    throw 'invalid'

  }

};
