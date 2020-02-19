// if (process.env.NODE_ENV !== 'production' || process.env.sails_environment === 'staging') {
//   return false
// } else {
//   var Queue = require('bull');
//
//   var paymentEmailQueue = new Queue('PaymentEmailQueue', sails.config.jobs.url);
//
//   var userEmailQueue = new Queue('UserEmailQueue', sails.config.jobs.url);
//
//   var emailTriggerQueue = new Queue('EmailTriggerQueue', sails.config.jobs.url);
//
//   emailTriggerQueue.process('SendEmails', 100, async function (job) {
//     // Send Failed Payment Email
//
//     let failedPayments = await TransactionsLog.find({
//       where: {
//         type: 'S_ERROR',
//         serialize: {
//           '!=': 's:49:"Error Occured while retrieving Stripe Customer ID";'
//         },
//         createdAt: {
//           '>=': new Date(Date.now() - 4 * 60 * 60 * 1000 - 15 * 60 * 1000),
//           '<': new Date(Date.now() - 4 * 60 * 60 * 1000),
//         }
//       }
//     });
//
//     failedPayments.forEach(function (payment) {
//       if (payment.user_id && payment.user_id !== 0) {
//         paymentEmailQueue.add('SendEmail', {
//             payment
//           },
//           {
//             attempts: 2,
//             timeout: 120000
//           })
//       }
//     });
//   });
//
//   paymentEmailQueue.process('SendEmail', 100, async function (job, done) {
//
//     sails.log.info({job: job.data});
//
//     let userData = await User.findOne({id: job.data.payment.user_id});
//
//     let description = '';
//     try {
//       description = job.data.payment.response.split('"')[1];
//     } catch (e) {
//       sails.hooks.bugsnag.notify(e)
//     }
//
//     let message = `ChinesePod Team,\n\nA user payment has failed. Additional information below:\nUser: ${userData.name}\nCRM: https://www2.chinesepod.com/marketingcenter/users/index/view?user_id=${userData.id}\nEmail: ${userData.email}\nDescription: ${description}\n\nSincerely,\nThe Reporting System`;
//
//     let Mailgun = require('machinepack-mailgun');
//
//     Mailgun.sendPlaintextEmail({
//
//       apiKey: sails.config.custom.mailgunSecret,
//
//       domain: sails.config.custom.mailgunDomain,
//
//       toEmail: 'followup@chinesepod.com',
//
//       toName: 'ChinesePod Followup Team',
//
//       subject: 'Stripe New Subscription Payment Error!',
//
//       message: message,
//
//       fromEmail: 'stripe@chinesepod.com',
//
//       fromName: 'ChinesePod Stripe',
//
//     }).exec({
//
// // An unexpected error occurred.
//
//       error: function (err) {
//         sails.hooks.bugsnag.notify(err);
//       },
//
// // OK.
//
//       success: function () {
//
//       },
//     });
//
//     done();
//   });
//
//   userEmailQueue.process('SendEmail', 10, async function (job, done) {
//     sails.log.info({job: job.data});
//
//     if (job.data.emailType && job.data.emailType === 'email-alice-inactive-user-asia') {
//
//       let greeting = await sails.helpers.users.calculateUserGreeting(job.data.userId);
//
//       const path = require('path');
//       const url = require('url');
//       const util = require('util');
//
//       const layout = false;
//
//       // Determine appropriate email layout and template to use.
//       const emailTemplatePath = path.join('emails/', 'automated/email-alice-inactive-user-asia');
//
//       // Compile HTML template.
//       // > Note that we set the layout, provide access to core `url` package (for
//       // > building links and image srcs, etc.), and also provide access to core
//       // > `util` package (for dumping debug data in internal emails).
//       const htmlEmailContents = await sails.renderView(
//         emailTemplatePath,
//         _.extend({layout, url, util }, {greeting: greeting})
//       )
//         .intercept((err)=>{
//           err.message =
//             'Could not compile view template.\n'+
//             '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
//             'Details:\n'+
//             err.message;
//           done(err);
//         });
//
//       await sails.helpers.mailgun.sendHtmlEmail.with({
//         htmlMessage: htmlEmailContents,
//         to: job.data.email,
//         subject: `Haven't Seen You in a While`,
//         from: 'alice@chinesepod.com',
//         fromName: 'Alice Shih'
//       })
//         .catch(err => done(err));
//
//       await EmailLogs.create({user_id: job.data.userId, email_id: job.data.emailType});
//
//     }
//     if (job.data.emailType && job.data.emailType === 'email-susie-inactive-user-europe') {
//
//       let greeting = await sails.helpers.users.calculateUserGreeting(job.data.userId);
//
//       const path = require('path');
//       const url = require('url');
//       const util = require('util');
//
//       const layout = false;
//
//       // Determine appropriate email layout and template to use.
//       const emailTemplatePath = path.join('emails/', 'automated/email-susie-inactive-user-europe');
//
//       // Compile HTML template.
//       // > Note that we set the layout, provide access to core `url` package (for
//       // > building links and image srcs, etc.), and also provide access to core
//       // > `util` package (for dumping debug data in internal emails).
//       const htmlEmailContents = await sails.renderView(
//         emailTemplatePath,
//         _.extend({layout, url, util }, {greeting: greeting})
//       )
//         .intercept((err)=>{
//           err.message =
//             'Could not compile view template.\n'+
//             '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
//             'Details:\n'+
//             err.message;
//           done(err);
//         });
//
//       await sails.helpers.mailgun.sendHtmlEmail.with({
//         htmlMessage: htmlEmailContents,
//         to: job.data.email,
//         subject: `Haven't Seen You in a While`,
//         from: 'susie@chinesepod.com',
//         fromName: 'Susie Lei'
//       })
//         .catch(err => done(err));
//
//       await EmailLogs.create({user_id: job.data.userId, email_id: job.data.emailType});
//
//     }
//
//     done()
//
//   });
//
//
//
//   // emailTriggerQueue.removeRepeatable('ScheduleInactivityEmailsProduction', {repeat: {cron: '55 9 24 1 *'}});
//   // emailTriggerQueue.removeRepeatable('ScheduleInactivityEmailsProduction', {repeat: {cron: '55 16 24 1 *'}});
//
//   // emailTriggerQueue.add('ScheduleInactivityEmailsProduction', {group: 'asia'}, {repeat: {cron: '55 9 24 1 *'}});
//   // emailTriggerQueue.add('ScheduleInactivityEmailsProduction', {group: 'europe'}, {repeat: {cron: '55 16 24 1 *'}});
//
//   // emailTriggerQueue.removeRepeatable('AddInactivityEmailLists', {repeat: {cron: '0 * * * *'}});
//   // emailTriggerQueue.add('AddInactivityEmailLists', {group: 'europe'}, {repeat: {cron: '0 * * * *'}});
//
// }
