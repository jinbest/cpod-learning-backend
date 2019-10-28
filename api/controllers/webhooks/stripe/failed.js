module.exports = {


  friendlyName: 'Failed',


  description: 'Failed Stripe Payment',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let Mailgun = require('machinepack-mailgun');

    let payload = this.req.body;

    let message = JSON.stringify(payload);

    let userData = null;

    if (payload.data.object.source.customer) {
      let userId = parseInt(payload.data.object.source.customer);
      userData = await User.findOne({id: userId});
    }

    let userName = payload.data.object.billing_details.name ? payload.data.object.billing_details.name : userData.name;
    let email = userData.email;

    switch (payload.type) {
      case 'charge.failed':
        message = `ChinesePod Team,\n\nA user payment has failed. Additional information below:\nUser: ${userName}\nCRM: https://www2.chinesepod.com/marketingcenter/users/index/view?user_id=${payload.data.object.source.customer}\nEmail: ${email}\nDescription: ${payload.data.object.description}\nIssue: ${payload.data.object.failure_message}\nReceipt: ${payload.data.object.receipt_url}\n\nSincerely,\nThe Reporting System`;
        break;
    }


    Mailgun.sendPlaintextEmail({

      apiKey: sails.config.custom.mailgunSecret,

      domain: sails.config.custom.mailgunDomain,

      toEmail: 'followup@chinesepod.com',

      toName: 'ChinesePod Followup Team',

      subject: payload.data && payload.data.object && payload.data.object.description ? payload.data.object.description : 'Stripe Payment Error!',

      message: message,

      fromEmail: 'stripe@chinesepod.com',

      fromName: 'ChinesePod Stripe Issue',

    }).exec({

// An unexpected error occurred.

      error: function (err) {
        sails.hooks.bugsnag.notify(err);
      },

// OK.

      success: function () {

      },
    });

  }


};
