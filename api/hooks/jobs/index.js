/**
 * jobs hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineJobsHook(sails) {

  // if (sails.config.environment !== 'production' || sails.config.environment === 'staging') {
  if (sails.config.environment === 'development') {
    return {
      initialize: async function () {
        sails.log.info('Ignoring hook (`APM`) for DEV')
      }
    }
  }

  return {

    initialize: async function (done) {
      sails.on('hook:orm:loaded', function () {
        sails.log.info('Initializing Rozkalns\' hook (`Bull Jobs`) 😎');

        let Queue = require('bull');

        //               //
        // LOGGING QUEUE //
        //               //
        let loggingQueue = new Queue('LoggingQueue', sails.config.jobs.url);
        loggingQueue.on('ready', () => {
          sails.log.info('loggingQueue ready!');
        });
        loggingQueue.on('failed', (job, e) => {
          // sails.log.error('loggingQueue failed:', job.id, e);
        });

        loggingQueue.process('Logging Requests', 5, async function (job, done) {
          if (!job.data) {
            done(null, 'No job data')
          }
          let userData = {};

          if (job.data.userId) {
            try {
              userData = await User.findOne({id: job.data.userId});
            } catch (e) {
              sails.log.error(e);
              done(e)
            }
          }
          await sails.helpers.logs.createLog({
            id: userData.email ? userData.email : 'NONE',
            access_ip: job.data.ip,
            accesslog_url: job.data.url,
            accesslog_sessionid: job.data.sessionId,
            accesslog_urlbase: job.data.urlbase,
            accesslog_country: null,
            timestamp: job.data.timestamp,
            accesslog_time: job.data.timestamp,
            referer: job.data.referer,
            userData: userData,
            ua: job.data.ua
          });

          done(null, userData.email ? `Logged Request for User: ${userData.email}` : `Logged Request for Unknown User`)

        });
        loggingQueue.clean(1000);
        // loggingQueue.clean(1000, 'failed');

        global.loggingQueue = loggingQueue;

        //                 //
        // USER INFO QUEUE //
        //                 //
        var userInfoQueue = new Queue('UserInfoQueue', sails.config.jobs.url);
        var cleanupQueue = new Queue('CleanupQueue', sails.config.jobs.url);

        userInfoQueue.on('ready', () => {
          sails.log.info('userInfoQueue ready!');
        });
        userInfoQueue.on('failed', (job, e) => {
          // sails.log.error('userInfoQueue failed:', job.id, e);
        });
        userInfoQueue.on('completed', (job, result) => {
          // sails.log.info('userInfoQueue job finished:', job.data.id ? job.data.id : job.data.email, result ? result : '');
          // cleanupQueue.add(job, {
          //   jobId: job.id,
          //   // delete job after one hour
          //   delay: 1000 * 60 * 60,
          //   removeOnComplete: true
          // });
        });

        cleanupQueue.process(async job => {
          const userInfoJob = await userInfoQueue.getJob(job.id);
          if (!userInfoJob) {
            return;
          }
          userInfoJob.remove();
        });

        userInfoQueue.process('Update Data to Mautic', 5, async function (job, done) {

          done();

          if (!job.data) {
            done('No job data')
          }

          let userData = null;

          if (!job.data.userId && job.data.email) {
            userData = await sails.models['user'].findOne({email: job.data.email});
          } else if (job.data.userId) {
            userData = await sails.models['user'].findOne({id: job.data.userId});
          } else {
            done(null, 'Not Enough Job Data to Pursue');
          }

          if (!userData || !userData.id || typeof userData === 'undefined') {
            //TODO SOMETHING HERE
            sails.log.error({
              jobData: job.data,
              userData: userData
            });
            done(null, 'No Such User on ChinesePod');
            return
          }

          let userOptions = null;

          try {
            userOptions = await sails.models['useroptions'].findOne({
              user_id: userData.id,
              option_key: 'level'
            })
          } catch (e) {
            sails.hooks.bugsnag.notify(e);
            done(null, 'No Such User on ChinesePod')
          }

          let userSiteLinks = [];

          try {
            userSiteLinks = await sails.models['usersitelinks'].find({user_id: userData.id, site_id: 2})
              .sort('updatedAt DESC')
              .limit(1);
          } catch (e) {
            sails.hooks.bugsnag.notify(e);
            done(null, 'No Such User on ChinesePod')
          }

          let subscription = 'Free';
          if (userSiteLinks.length > 0) {
            switch (userSiteLinks[0].usertype_id) {
              case 5:
                subscription = 'Premium'; //Premium
                break;
              case 6:
                subscription = 'Basic'; //Basic
                break;
              case 7:
                subscription = 'Free'; //Free
                break;
              case 1:
                subscription = 'Premium'; //Admin
                break;
            }
          }

          let levelText = '';
          if (userOptions && userOptions.option_value) {
            switch (userOptions.option_value) {
              case 1:
                levelText = 'Newbie';
                break;
              case 2:
                levelText = 'Elementary';
                break;
              // Due to an old mistake PreInt === 6
              case 6:
                levelText = 'Pre Intermediate';
                break;
              case 3:
                levelText = 'Intermediate';
                break;
              case 4:
                levelText = 'Upper Intermediate';
                break;
              case 5:
                levelText = 'Advanced';
                break;
            }
          }
          let userSettings = null;

          try {
            userSettings = await sails.models['usersettings'].findOne({user_id: userData.id});
          } catch (e) {

          }

          let charSet = 'simplified';

          try {
            let rawChar = userSettings.setting.split('"ctype";i:')[1].slice(0, 1);
            if (rawChar == 2) {
              charSet = 'traditional';
            }

          } catch (e) {
            await sails.helpers.users.setCharSet(userData.id, charSet);
          }

          const MauticConnector = require('node-mautic');
          const mauticConnector = new MauticConnector({
            apiUrl: 'https://email.chinesepod.com',
            username: 'CpodJsWebsite',
            password: 'zro5YdSykdqYkkgPMBH9yCcGPguGdAbk8IXyjnCW'
          });

          //Check if Webhook & Get Mautic ID from Webhook
          if (job.data.mauticData) {
            userData = await User.updateOne({id: userData.id})
              .set({member_id: job.data.mauticData.contact.id})
          }

          let updatedUser = '';

          //No Mautic ID in UserData
          if (!userData.member_id) {

            let mauticUser = await sails.models['mauticcontacts'].findOne({email: userData.email});


            //If User exists - Add Mautic ID to user record
            if (mauticUser) {
              userData = await sails.models['user'].updateOne({id: userData.id})
                .set({member_id: mauticUser.id})
                .catch((err) => {
                  sails.hooks.bugsnag.notify(err);
                  done(new Error(err))
                });
              //Push Updated Data to Mautic
              let mauticData = {
                subscription: subscription,
                userid: userData.id,
                email: userData.email,
                charset: charSet,
                confirmed: userData.confirm_status,
                confirmlink: `https://www.chinesepod.com/email/confirm?code=${encodeURIComponent(userData.code)}`,
                lessoncount: await sails.helpers.users.countLessons.with({email: userData.email, timeframe: 7}),
                subscribedate: userData.createdAt
              };
              if (levelText) {
                mauticData.level = levelText;
              }
              if (userSiteLinks.expiry) {
                mauticData.expirydate = userSiteLinks.expiry;
              }
              if (userData.name) {
                mauticData.fullname = userData.name;
              }

              updatedUser = await sails.models['mauticcontacts'].updateOne({id: userData.member_id})
                .set(mauticData);

            } else {

              //If User Does not Exist on Mautic - Create a new User record
              let mauticData = {
                email: userData.email,
                subscription: subscription,
                userid: userData.id,
                charset: charSet,
                confirmed: userData.confirm_status,
                confirmlink: `https://www.chinesepod.com/email/confirm?code=${encodeURIComponent(userData.code)}`,
                lessoncount: await sails.helpers.users.countLessons.with({email: userData.email, timeframe: 7}),
                subscribedate: userData.createdAt
              };

              if (levelText) {
                mauticData.level = levelText;
              }
              if (userSiteLinks.expiry) {
                mauticData.expirydate = userSiteLinks.expiry;
              }
              if (userData.name) {
                mauticData.fullname = userData.name;
              }

              updatedUser = await mauticConnector.contacts.createContact(mauticData)
                .catch(async (err) => {
                  await MauticErrorLogs.create({
                    userId: userData.id,
                    error: JSON.stringify({mauticData: mauticData, err: `${err}`})
                  });
                  done({mauticData: mauticData, err: err})
                });

              if (updatedUser) {
                userData = await sails.models['user'].updateOne({id: userData.id})
                  .set({member_id: updatedUser.contact.id});
              }
            }

          } else {

            //If User Already has a Mautic ID

            let mauticData = {
              subscription: subscription,
              userid: userData.id,
              email: userData.email,
              charset: charSet,
              confirmed: userData.confirm_status,
              confirmlink: `https://www.chinesepod.com/email/confirm?code=${encodeURIComponent(userData.code)}`,
              lessoncount: await sails.helpers.users.countLessons.with({email: userData.email, timeframe: 7}),
              subscribedate: userData.createdAt
            };
            if (levelText) {
              mauticData.level = levelText;
            }
            if (userSiteLinks.expiry) {
              mauticData.expirydate = userSiteLinks.expiry;
            }
            if (userData.name) {
              mauticData.fullname = userData.name;
              mauticData.firstname = await sails.helpers.users.calculateFirstName(userData.name);
            }

            try {
              updatedUser = await sails.models['mauticcontacts'].updateOne({id: userData.member_id})
                .set(mauticData);
            } catch (e) {
              sails.hooks.bugsnag.notify(e);
              done(e)
            }

          }

          if (updatedUser) {
            done(null, 'Updated on Mautic');
          } else {
            done(new Error(`User Data ${job.data.userId ? job.data.userId : ''} ${job.data.email ? job.data.email : ''} could not be pushed to Mautic`))
          }
        });

        //                  //
        // USER EVENT QUEUE //
        //                  //
        userInfoQueue.process('LogEvent', 2, async function (job, done) {
          if (!job.data) {
            done(null, 'No job data')
          }
          await sails.helpers.logs.createEvent(job.data);
          done()
        });

        //                     //
        // USER PROGRESS QUEUE //
        //                     //
        userInfoQueue.process('LogProgress', 2, async function (job, done) {
          if (!job.data) {
            done(null, 'No job data')
          }

          let inputs = job.data;
          await sails.helpers.lessons.logProgress.with({userId: inputs.userId, lessonId: inputs.lessonId, track: inputs.track, progress: inputs.progress, source: inputs.source});
          done()
        });

        userInfoQueue.process('SetCurrentLesson', 1, async function (job) {

          let email = job.data.email;

          let latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(email, 1);

          if (!latestStudiedLesson) {
            latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(email, 3);
          }

          if (!latestStudiedLesson) {
            latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(email, 7);
          }

          if (!latestStudiedLesson) {
            latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(email, 14);
          }

          if (!latestStudiedLesson) {
            latestStudiedLesson = await sails.helpers.users.getUserCurrentLessonFromLogs(email, 30);
          }

          if (latestStudiedLesson) {

            let userData = await User.findOne({email: email});

            job.data.userId = userData.id;

            await sails.helpers.users.setCurrentLesson.with({userId: job.data.userId, lessonId: latestStudiedLesson})

          }

        });

        userInfoQueue.process('UpdateUseParameters', 1, async function(job) {
          let email = job.data.email; let logData = [];
          let userData = await User.findOne({email: email});
          if (!userData || !userData.id) {
            return 'No such user'
          }
          let latestLogs = await BackupLogging.find({id: email}).sort('createdAt DESC').limit(10);
          if (latestLogs && Array.isArray(latestLogs) && latestLogs.length) {
            [...new Set(latestLogs.map(log => log.accesslog_urlbase.split('https://')[1].split('.')[0]))].forEach(log => {
              switch (log) {
                case 'www':
                  logData.push({user_id: userData.id, option_key: 'newDashboard', option_value: new Date()})
                  break;
                case 'ws':
                  logData.push({user_id: userData.id, option_key: 'androidApp', option_value: new Date()})
                  break;
                case 'server4':
                  logData.push({user_id: userData.id, option_key: 'iosApp', option_value: new Date()})
                  break;
                case 'chinesepod':
                  logData.push({user_id: userData.id, option_key: 'oldDashboard', option_value: new Date()})
                  break;
              }
            });
            return await UserOptions.createEach().fetch();
          }
          return 'No Logs'
        });

        global.userInfoQueue = userInfoQueue;

        userInfoQueue.clean(1000);

        done()
      })
    },
  };


};
