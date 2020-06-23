module.exports = {


  friendlyName: 'Signup form',


  description: '',


  inputs: {

    data: {
      type: {},
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userData = await User.findOne({id: inputs.userId});
    await UserOptions.updateOrCreate({user_id: inputs.userId, option_key: 'recapBetaSignup'}, {user_id: inputs.userId, option_key: 'recapBetaSignup', option_value: JSON.stringify(inputs.data)});

    let moment = require('moment');
    let expiry = moment(new Date()).add(1, 'months').toDate();

    let voucher = await Vouchers.create({
      voucher_code: await sails.helpers.strings.random('url-friendly').slice(0,10).toUpperCase(),
      product_id: 2,
      expiry_date: expiry,
    })
      .intercept('E_UNIQUE', () => {sails.hooks.bugsnag.notify('Voucher already exists')})
      .fetch();

    if (!voucher) {
      voucher = await Vouchers.create({
        voucher_code: await sails.helpers.strings.random('url-friendly').slice(0,10).toUpperCase(),
        product_id: 18,
        expiry_date: expiry,
      })
        .intercept('E_UNIQUE', () => {sails.hooks.bugsnag.notify('Voucher already exists')})
        .fetch();
    }

    let firstName = await sails.helpers.users.calculateFirstName(userData.name);

    sails.log.info(userData)

    await sails.helpers.mailgun.sendHtmlEmail.with({
      htmlMessage: `
      <div>New Signup</div>
      <br/>
      <div>${userData.name} ${userData.email}</div>
      <br/>
      <div>${JSON.stringify(inputs.data)}</div>
      `,
      to: 'feedback@chinesepod.com',
      subject: 'Recap Beta Signups',
      from: 'team@chinesepod.com',
      fromName: 'ChinesePod Website'
    });

    await sails.helpers.sendTemplateEmail.with({
      to: userData.email, //'recap-request@chinesepod.com',
      subject: `Free Access for Beta Testers!`,
      template: 'automated/email-gift',
      layout: false,
      toName: userData.name,
      templateData: {
        firstName: firstName ? firstName : 'Student',
        claimLink: `https://www.chinesepod.com/redeem-gift/${voucher.voucher_code}/${userData.code}`
      }
    });

    // All done.
    return;

  }


};
