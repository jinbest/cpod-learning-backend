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

  userEmailQueue.process('SendEmail', 10, async function (job, done) {
    sails.log.info({job: job.data});

    if (job.data.emailType && job.data.emailType === 'email-alice-inactive-user-asia') {

      let greeting = await sails.helpers.users.calculateUserGreeting(job.data.userId);

      const path = require('path');
      const url = require('url');
      const util = require('util');

      const layout = false;

      // Determine appropriate email layout and template to use.
      const emailTemplatePath = path.join('emails/', 'automated/email-alice-inactive-user-asia');

      // Compile HTML template.
      // > Note that we set the layout, provide access to core `url` package (for
      // > building links and image srcs, etc.), and also provide access to core
      // > `util` package (for dumping debug data in internal emails).
      const htmlEmailContents = await sails.renderView(
        emailTemplatePath,
        _.extend({layout, url, util }, {greeting: greeting})
      )
        .intercept((err)=>{
          err.message =
            'Could not compile view template.\n'+
            '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
            'Details:\n'+
            err.message;
          done(err);
        });

      await sails.helpers.mailgun.sendHtmlEmail.with({
        htmlMessage: htmlEmailContents,
        to: job.data.email,
        subject: `Haven't Seen You in a While`,
        from: 'alice@chinesepod.com',
        fromName: 'Alice Shih'
      })
        .catch(err => done(err));

      await EmailLogs.create({user_id: job.data.userId, email_id: job.data.emailType});

    }
    if (job.data.emailType && job.data.emailType === 'email-susie-inactive-user-europe') {

      let greeting = await sails.helpers.users.calculateUserGreeting(job.data.userId);

      const path = require('path');
      const url = require('url');
      const util = require('util');

      const layout = false;

      // Determine appropriate email layout and template to use.
      const emailTemplatePath = path.join('emails/', 'automated/email-susie-inactive-user-europe');

      // Compile HTML template.
      // > Note that we set the layout, provide access to core `url` package (for
      // > building links and image srcs, etc.), and also provide access to core
      // > `util` package (for dumping debug data in internal emails).
      const htmlEmailContents = await sails.renderView(
        emailTemplatePath,
        _.extend({layout, url, util }, {greeting: greeting})
      )
        .intercept((err)=>{
          err.message =
            'Could not compile view template.\n'+
            '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
            'Details:\n'+
            err.message;
          done(err);
        });

      await sails.helpers.mailgun.sendHtmlEmail.with({
        htmlMessage: htmlEmailContents,
        to: job.data.email,
        subject: `Haven't Seen You in a While`,
        from: 'susie@chinesepod.com',
        fromName: 'Susie Lei'
      })
        .catch(err => done(err));

      await EmailLogs.create({user_id: job.data.userId, email_id: job.data.emailType});

    }

    done()

  });

  emailTriggerQueue.process('ScheduleInactivityEmails', 1, async function (job, done) {

    let users = ['ugis@chinesepod.com'];

    let userData = await sails.models['user'].find({email: {in: users}});

    userData.forEach(user => {

      userEmailQueue.add('SendEmail', {userId: user.id, email: user.email, user: user, emailType: 'email-alice-inactive-user-asia'});
      userEmailQueue.add('SendEmail', {userId: user.id, email: user.email, user: user, emailType: 'email-susie-inactive-user-europe'});

    })

  });

  emailTriggerQueue.process('ScheduleInactivityEmailsProduction', 1, async function (job, done) {

    sails.hooks.bugsnag.notify('Sending Mass Emails');

    let users = ['ugis@chinesepod.com', 'ugis+android@chinesepod.com'];

    let userData = await sails.models['user'].find({email: {in: users}});

    userData.forEach(user => {

      if (user.ip_address) {

        const geoip = require('geoip-country');

        const geo = geoip.lookup(user.ip_address);

        let asiaCountries = ["YE", "IQ", "SA", "IR", "SY", "AM", "JO", "LB", "KW", "OM", "QA", "BH", "AE", "IL", "TR",
          "AZ", "GE", "AF", "PK", "BD", "TM", "TJ", "LK", "BT", "IN", "MV", "IO", "NP", "MM", "UZ", "KZ", "KG", "CC",
          "PW", "VN", "TH", "ID", "LA", "TW", "PH", "MY", "CN", "HK", "BN", "MO", "KH", "KR", "JP", "KP", "SG", "CK",
          "TL", "MN", "AU", "CX", "MH", "FM", "PG", "SB", "TV", "NR", "VU", "NC", "NF", "NZ", "FJ", "PF", "PN", "KI",
          "TK", "TO", "WF", "WS", "NU", "MP", "GU", "UM", "AS", "PS"];

        const europeanCountries = ["CY", "GR", "EE", "LV", "LT", "SJ", "MD", "BY", "FI", "AX", "UA", "MK", "HU", "BG",
          "AL", "PL", "RO", "XK", "RU", "PT", "GI", "ES", "MT", "FO", "DK", "IS", "GB", "CH", "SE", "NL", "AT", "BE",
          "DE", "LU", "IE", "MC", "FR", "AD", "LI", "JE", "IM", "GG", "SK", "CZ", "NO", "VA", "SM", "IT", "SI", "ME",
          "HR", "BA", "RS"];

        if (geo && asiaCountries.includes(geo.country) && job.group === 'asia') {

          sails.hooks.bugsnag.notify('Send Email to Asia');

          userEmailQueue.add('SendEmail', {userId: user.id, email: user.email, user: user, emailType: 'email-alice-inactive-user-asia', country: geo.country})

        } else if (geo && europeanCountries.includes(geo.country) && job.group === 'europe'){

          sails.hooks.bugsnag.notify('Send Email to Europe');

          userEmailQueue.add('SendEmail', {userId: user.id, email: user.email, user: user, emailType: 'email-susie-inactive-user-europe', country: geo.country})

        } else if (geo && job.group === 'testing') {

          sails.hooks.bugsnag.notify(JSON.stringify({...user, ...job.data}));

        }

      }

    });

    done()

  });


  emailTriggerQueue.removeRepeatable('SendEmails', {repeat: {cron: '*/15 * * * *'}});

  emailTriggerQueue.removeRepeatable('ScheduleInactivityEmails', {repeat: {cron: '*/15 * * * *'}});
  emailTriggerQueue.removeRepeatable('ScheduleInactivityEmailsProduction', {repeat: {cron: '55 9 24 1 *'}});
  emailTriggerQueue.removeRepeatable('ScheduleInactivityEmailsProduction', {repeat: {cron: '55 16 24 1 *'}});
  emailTriggerQueue.removeRepeatable('ScheduleInactivityEmailsProduction', {repeat: {cron: '*/10 * * * *'}});

  emailTriggerQueue.add('ScheduleInactivityEmails', {data: 'Send Follow-up email to recently inactive users'}, {repeat: {cron: '*/15 * * * *'}});
  emailTriggerQueue.add('ScheduleInactivityEmailsProduction', {group: 'asia'}, {repeat: {cron: '55 9 24 1 *'}});
  emailTriggerQueue.add('ScheduleInactivityEmailsProduction', {group: 'europe'}, {repeat: {cron: '55 16 24 1 *'}});
  emailTriggerQueue.add('ScheduleInactivityEmailsProduction', {group: 'testing'}, {repeat: {cron: '*/10 * * * *'}});

}
