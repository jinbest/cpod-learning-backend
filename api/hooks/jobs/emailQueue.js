if (process.env.NODE_ENV !== 'production' || process.env.sails_environment === 'staging') {
  return false
} else {
  var Queue = require('bull');

  var paymentEmailQueue = new Queue('PaymentEmailQueue', sails.config.jobs.url);

  var userEmailQueue = new Queue('UserEmailQueue', sails.config.jobs.url);

  var emailTriggerQueue = new Queue('EmailTriggerQueue', sails.config.jobs.url);

  emailTriggerQueue.process('SendEmails', 100, async function (job) {
    // Send Failed Payment Email

    let failedPayments = await TransactionsLog.find({
      where: {
        type: 'S_ERROR',
        serialize: {
          '!=': 's:49:"Error Occured while retrieving Stripe Customer ID";'
        },
        createdAt: {
          '>=': new Date(Date.now() - 4 * 60 * 60 * 1000 - 15 * 60 * 1000),
          '<': new Date(Date.now() - 4 * 60 * 60 * 1000),
        }
      }
    });

    failedPayments.forEach(function (payment) {
      if (payment.user_id && payment.user_id !== 0) {
        paymentEmailQueue.add('SendEmail', {
            payment
          },
          {
            attempts: 2,
            timeout: 120000
          })
      }
    });
  });

  emailTriggerQueue.removeRepeatable('SendEmails', {repeat: {cron: '*/15 * * * *'}});

  paymentEmailQueue.process('SendEmail', 100, async function (job, done) {

    sails.log.info({job: job.data});

    let userData = await User.findOne({id: job.data.payment.user_id});

    let description = '';
    try {
      description = job.data.payment.response.split('"')[1];
    } catch (e) {
      sails.hooks.bugsnag.notify(e)
    }

    let message = `ChinesePod Team,\n\nA user payment has failed. Additional information below:\nUser: ${userData.name}\nCRM: https://www2.chinesepod.com/marketingcenter/users/index/view?user_id=${userData.id}\nEmail: ${userData.email}\nDescription: ${description}\n\nSincerely,\nThe Reporting System`;

    let Mailgun = require('machinepack-mailgun');

    Mailgun.sendPlaintextEmail({

      apiKey: sails.config.custom.mailgunSecret,

      domain: sails.config.custom.mailgunDomain,

      toEmail: 'followup@chinesepod.com',

      toName: 'ChinesePod Followup Team',

      subject: 'Stripe New Subscription Payment Error!',

      message: message,

      fromEmail: 'stripe@chinesepod.com',

      fromName: 'ChinesePod Stripe',

    }).exec({

// An unexpected error occurred.

      error: function (err) {
        sails.hooks.bugsnag.notify(err);
      },

// OK.

      success: function () {

      },
    });

    done();
  });

}
