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
    // delete job after one day
    delay: 1000 * 60 * 60 * 24,
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

userInfoQueue.process('Update Data to Mautic', 5,async function (job, done) {

  if (!job.data) {
    done( null, 'No job data')
  }

  let userData = null;

  if (!job.data.userId && job.data.email) {
    userData = await User.findOne({email: job.data.email});
  } else if (job.data.userId) {
    userData = await User.findOne({id: job.data.userId});
  } else {
    done( null, 'Not Enough Job Data to Pursue');
  }

  if (!userData || !userData.id || typeof userData === 'undefined') {
    //TODO SOMETHING HERE
    sails.log.error({
      jobData: job.data,
      userData: userData
    });
    done( null, 'No Such User on ChinesePod');
    return
  }

  let userOptions = null;

  try {
    userOptions = await UserOptions.findOne({
      user_id: userData.id,
      option_key: 'level'
    })
  } catch (e) {
    sails.hooks.bugsnag.notify(e);
    done( null, 'No Such User on ChinesePod')
  }

  let userSiteLinks = [];

  try {
    userSiteLinks = await UserSiteLinks.find({user_id: userData.id, site_id: 2})
      .sort('updatedAt DESC')
      .limit(1);
  } catch (e) {
    sails.hooks.bugsnag.notify(e);
    done( null, 'No Such User on ChinesePod')
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
  if(userOptions && userOptions.option_value) {
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
  //TODO IMPLEMENT USER CHAR SETS
  let userSettings = null;

  try {
    userSettings = await UserSettings.findOne({user_id: userData.id});
  } catch (e) {

  }

  let charSet = 'simplified';

  try {
    let rawChar = userSettings.setting.split('"ctype";i:')[1].slice(0,1);
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
      updatedUser = await mauticConnector.contacts.editContact('PATCH',mauticData,userData.member_id)
        .catch(async(err) => {
          await MauticErrorLogs.create({
            userId: userData.id,
            error: JSON.stringify({mauticData: mauticData, err:`${err}`})
          });
          done({mauticData: mauticData, err: err})
        });

      //If User Email is not unique - throw error - THIS SHOULD NEVER HAPPEN
    } else if (mauticUser.total > 1) {
      done(new Error('Email was not unique on Mautic'));

      //If User Does not Exist on Mautic - Create a new User record
    } else if (mauticUser.total == 0) {
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
      sails.log.info(mauticData);
      updatedUser = await mauticConnector.contacts.createContact( mauticData )
        .catch(async(err) => {
          await MauticErrorLogs.create({
            userId: userData.id,
            error: JSON.stringify({mauticData: mauticData, err:`${err}`})
          });
          done({mauticData: mauticData, err: err})
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
      if (userData.name.split(' ').length > 1) {
        mauticData.firstname = userData.name.split(' ')[0]
      }
    }
    updatedUser = await mauticConnector.contacts.editContact('PATCH',mauticData,userData.member_id)
      .catch(async(err) => {
        await MauticErrorLogs.create({
          userId: userData.id,
          error: JSON.stringify({mauticData: mauticData, err:`${err}`})
        });
        done({mauticData: mauticData, err: err})
      });
  }

  if (updatedUser) {
    done(null, 'Updated on Mautic');
  } else {
    done(new Error('User Data could not be pushed to Mautic'))
  }
});

triggerQueue.process('UpdateUsers',1,async function (job){

  let userList = [];

  let usersToUpdate = await User.find({
    where: {
      updatedAt: {
        '>=': new Date(Date.now() - 15 * 60 * 1000 - 5 * 60 * 60 * 1000)
      }
    },
    select: ['id']
  });
  usersToUpdate.map(function (el) {
    userList.push(el.id)
  });

  let optionsToUpdate = await UserOptions.find({
    where: {
      option_key: {
        'in': ['level']
      },
      updatedAt: {
        '>=': new Date(Date.now() - 15 * 60 * 1000 - 5 * 60 * 60 * 1000)
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
        '>=': new Date(Date.now() - 15 * 60 * 1000 - 5 * 60 * 60 * 1000)
      }
    },
    select: ['user_id']
  });
  subscriptionsToUpdate.map(function (el) {
    userList.push(el.user_id)
  });

  sails.log.info({count: userList.length});

  if(userList.length < 400) {
    Array.from(new Set(userList)).forEach(function (user) {
      userInfoQueue.add('Update Data to Mautic', {
          userId: user
        },
        {
          attempts: 2,
          timeout: 120000
        })
    });
  }
});

triggerQueue.process('UpdateUsersWithNoID',1,async function (job){
  // Update Users to Mautic

  let userList = [];

  let usersToUpdate = await User.find({
    where: {
      member_id: null,
      updatedAt: {
        '>=': '2019-06-01'
      }
    },
    select: ['id']
  });
  usersToUpdate.map(function (el) {
    userList.push(el.id)
  });

  Array.from(new Set(userList)).forEach(function (user) {
    userInfoQueue.add('Update Data to Mautic', {
        userId: user
      },
      {
        attempts: 1,
        timeout: 120000
      })
  });
});

triggerQueue.process('UpdateAllUsers',1,async function (job){
  // Update Users to Mautic

  let userList = [];

  let usersToUpdate = await User.find({
    where: {
      member_id: {
        '!': null
      },
      updatedAt: {
        '>=': new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
      }
    },
    select: ['id']
  });
  usersToUpdate.map(function (el) {
    userList.push(el.id)
  });

  sails.log.info(userList.length);

  Array.from(new Set(userList)).forEach(function (user) {
    userInfoQueue.add('Update Data to Mautic', {
        userId: user
      },
      {
        attempts: 1,
        timeout: 120000
      })
  });
});

triggerQueue.removeRepeatable('UpdateUsers',{repeat: {cron: '*/15 * * * *'}});
triggerQueue.removeRepeatable('UpdateUsersWithNoID',{repeat: {cron: '15 * * * *'}});
triggerQueue.removeRepeatable('UpdateUsersWithNoID',{repeat: {cron: '15 4 * * *'}});
// triggerQueue.removeRepeatable('UpdateUsers',{repeat: {cron: '*/1 * * * *'}});

triggerQueue.add('UpdateUsers', {data:'Push User Data to Mautic every 15min'},{repeat: {cron: '*/15 * * * *'}});
triggerQueue.add('UpdateUsersWithNoID', {data:'Push Missing User Data to Mautic every hour'},{repeat: {cron: '15 * * * *'}});
triggerQueue.add('UpdateUsersWithNoID', {data:'Push Missing User Data to Mautic every hour'},{repeat: {cron: '15 4 * * *'}});

// triggerQueue.removeRepeatable('UpdateAllUsers',{repeat: {cron: '0 0 1 * *'}});
triggerQueue.removeRepeatable('UpdateAllUsers',{repeat: {cron: '5 4 * * 7'}});
// triggerQueue.removeRepeatable('UpdateAllUsers',{repeat: {cron: '0 1 * * *'}});
triggerQueue.add('UpdateAllUsers', {data:'Push All User Data to Mautic once a Month'},{repeat: {cron: '5 4 * * 7'}});
// triggerQueue.add('UpdateAllUsers', {data:'Push All User Data to Mautic once a Month'},{repeat: {cron: '0 1 * * *'}});

module.exports = userInfoQueue;