/**
 * jobs hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineJobsHook(sails) {

  var Queue = require('bull');

  var userInfoQueue = new Queue('UserInfoQueue', sails.config.jobs.url);
  var cleanupQueue = new Queue('CleanupQueue', sails.config.jobs.url);

  var triggerQueue = new Queue('TriggerQueue', sails.config.jobs.url);

  userInfoQueue.on('ready', () => {
    sails.log.info('userInfoQueue ready!');
  });
  userInfoQueue.on('failed', (job, e) => {
    sails.log.info('userInfoQueue failed:', job.id, e);
  });
  userInfoQueue.on('completed', (job, result) => {
    sails.log.info('userInfoQueue job finished:', job.data.id ? job.data.id : job.data.email, result);
    cleanupQueue.add(job, {
      jobId: job.id,
      // delete job after one week
      delay: 1000 * 60 * 60 * 24 * 7,
      removeOnComplete: true
    });
  });


  cleanupQueue.process(async job => {
    const userInfoJob = await userInfoQueue.getJob(job.id);
    if (!userInfoJob) {
      return;
    }
    userInfoJob.remove();
  });

  userInfoQueue.process('Update Data to Mautic', 100,async function (job, done) {

    let userData = '';
    if (!job.data.userId) {
      userData = await User.findOne({email: job.data.email})
        .catch((err) => {
          //TODO SOMETHING HERE
          done( null, 'No Such User on ChinesePod')
        });
    } else {
      userData = await User.findOne({id: job.data.userId})
        .catch((err) => {
          //TODO SOMETHING HERE
          done( null, 'No Such User on ChinesePod')
        });
    }

    if (!userData) {
      //TODO SOMETHING HERE
      done( null, 'No Such User on ChinesePod')
    }

    let userOptions = await UserOptions.findOne({
      user_id: userData.id,
      option_key: 'level'
    }).catch((err) => {
      //TODO SOMETHING HERE
    });

    let userSiteLinks = await UserSiteLinks.find({user_id: userData.id})
      .sort('updatedAt DESC')
      .limit(1);
    let subscription = 'Free';
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

    let levelText = '';
    if(userOptions) {
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

    const MauticConnector = require('node-mautic');
    const mauticConnector = new MauticConnector({
      apiUrl: 'https://email.chinesepod.com',
      username: 'CpodJsWebsite',
      password: 'zro5YdSykdqYkkgPMBH9yCcGPguGdAbk8IXyjnCW'
    });

    //Check if Webhook & Get Mautic ID from Webhook
    if (job.data.mauticData) {
      userData = await User.updateOne({id:userData.id})
        .set({member_id:job.data.mauticData.contact.id})
    }

    let updatedUser = '';

    //No Mautic ID in UserData
    if (!userData.member_id) {

      //Make an API call and check if user exists on Mautic
      let mauticUser = await mauticConnector.contacts.listContacts({
        search: `email:${userData.email}`
      });

      //If User exists - Add Mautic ID to user record
      if (mauticUser.total == 1) {
        userData = await User.updateOne({id:userData.id})
          .set({member_id: Object.keys(mauticUser.contacts)[0]})
          .catch((err) => {
            done(new Error(err))
          });
        //Push Updated Data to Mautic
        let mauticData = {
          subscription: subscription,
          userid: userData.id,
        }
        if (levelText) {
          mauticData.level = levelText;
        }
        if (userSiteLinks.expiry) {
          mauticData.expirydate = userSiteLinks.expiry;
        }
        if (userData.name) {
          mauticData.fullname = userData.name;
        }
        updatedUser = await mauticConnector.contacts.editContact('PATCH',mauticData,userData.member_id)
          .catch((err) => {
            done(new Error(err))
          });

        //If User Email is not unique - throw error - THIS SHOULD NEVER HAPPEN
      } else if (mauticUser.total > 1) {
        done(null, new Error('Email was not unique on Mautic'));

        //If User Does not Exist on Mautic - Create a new User record
      } else if (mauticUser.total == 0) {
        let mauticData = {
          email: userData.email,
          subscription: subscription,
          userid: userData.id,
        }
        if (levelText) {
          mauticData.level = levelText;
        }
        if (userSiteLinks.expiry) {
          mauticData.expirydate = userSiteLinks.expiry;
        }
        if (userData.name) {
          mauticData.fullname = userData.name;
        }
        sails.log.info(mauticData);
        updatedUser = await mauticConnector.contacts.createContact( mauticData )
          .catch((err) => {
            sails.log.info('Error with New Mautic Lead Creation');
            done(new Error(err));
          });
        if(updatedUser) {
          userData = await User.updateOne({id:userData.id})
            .set({member_id: updatedUser.contact.id});
        }
      }
    } else {
      let mauticData = {
        subscription: subscription,
        userid: userData.id,
      }
      if (levelText) {
        mauticData.level = levelText;
      }
      if (userSiteLinks.expiry) {
        mauticData.expirydate = userSiteLinks.expiry;
      }
      if (userData.name) {
        mauticData.fullname = userData.name;
      }
      updatedUser = await mauticConnector.contacts.editContact('PATCH',mauticData,userData.member_id)
        .catch((err) => {
          done(new Error(err))
        });
    }

    if (updatedUser) {
      done(null, 'Updated on Mautic');
    } else {
      done(new Error('User Data could not be pushed to Mautic'))
    }
  });

  triggerQueue.process('UpdateUsers',100,async function (job){
    // Update Users to Mautic

    let userList = [];

    let usersToUpdate = await User.find({
      where: {
        updatedAt: {
          '>=': new Date(Date.now() - 15 * 60 * 1000)
        }
      },
      select: ['id']
    });
    usersToUpdate.map(function (el) {
      userList.push(el.id)
    });

    let optionsToUpdate = await UserOptions.find({
      where: {
        updatedAt: {
          '>=': new Date(Date.now() - 15 * 60 * 1000)
        }
      },
      select: ['user_id']
    });
    optionsToUpdate.map(function (el) {
      userList.push(el.user_id)
    });


    let subscriptionsToUpdate = await UserSiteLinks.find({
      where: {
        updatedAt: {
          '>=': new Date(Date.now() - 15 * 60 * 1000)
        }
      },
      select: ['user_id']
    });
    subscriptionsToUpdate.map(function (el) {
      userList.push(el.user_id)
    });

    sails.log.info(userList);

    Array.from(new Set(userList)).forEach(function (user) {
      userInfoQueue.add('Update Data to Mautic', {
          userId: user
        },
        {
          attempts: 2,
          timeout: 120000
        })
    });
  });

  triggerQueue.removeRepeatable('UpdateUsers',{repeat: {cron: '*/15 * * * *'}});
  triggerQueue.add('UpdateUsers', {data:'Push User Data to Mautic every 15min'},{repeat: {cron: '*/15 * * * *'}});

  return {
    userInfoQueue: userInfoQueue,

    initialize: async function () {
      sails.log.info('Initializing Rozkalns\' hook (`Bull Jobs`) 😎')
    }
  };

};