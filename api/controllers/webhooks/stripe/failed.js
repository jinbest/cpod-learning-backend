module.exports = {


  friendlyName: 'Failed',


  description: 'Failed Stripe Payment',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let Mailgun = require('machinepack-mailgun');

    Mailgun.sendPlaintextEmail({

      apiKey: sails.config.custom.mailgunSecret,

      domain: sails.config.custom.mailgunDomain,

      toEmail: 'ugis@chinesepod.com',

      toName: 'Ugis Rozkalns',

      subject: 'Stripe Payment Error!',

      message: JSON.stringify(this.req.body),

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
