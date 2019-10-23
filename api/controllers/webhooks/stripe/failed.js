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

    switch (payload.type) {
      case 'charge.failed':
        message = `ChinesePod Team,\nA user payment has failed. Additional information below:\nUser: ${payload.data.object.billing_details.name}\nCRM:https://www2.chinesepod.com/marketingcenter/users/index/view?user_id=${payload.data.object.source.customer}\nEmail: ${payload.data.object.billing_details.email}\nDescription: ${payload.data.object.description}\nIssue: ${payload.data.object.failure_message}\nReceipt: ${payload.data.object.receipt_url}\nSincerely,\nThe Reporting System`;
        break;
    }





    Mailgun.sendPlaintextEmail({

      apiKey: sails.config.custom.mailgunSecret,

      domain: sails.config.custom.mailgunDomain,

      toEmail: 'ugis@chinesepod.com',

      toName: 'Ugis Rozkalns',

      subject: 'Stripe Payment Error!',

      message: message,

      fromEmail: 'stripe@chinesepod.com',

      fromName: 'ChinesePod Stripe Report',

    }).exec({

// An unexpected error occurred.

      error: function (err) {
        bugsnagClient.notify(err)
      },

// OK.

      success: function () {

      },
    });

  }


};
