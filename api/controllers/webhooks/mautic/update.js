module.exports = {


  friendlyName: 'Webhook',


  description: 'Webhook something.',


  inputs: {
    trigger: {
      type: {}
    },
    email: {
      type: 'string',
      isEmail: true
    }

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'Invalid use of this webhook',
    },
  },


  fn: async function (inputs) {
    let email = '';
    let data = this.req.body;
    let mauticData ={};
    try {
      if(data['mautic.lead_channel_subscription_changed']) {
        mauticData = data['mautic.lead_channel_subscription_changed'][0];
        email = mauticData.contact.fields.core.email.value;
      }
      if(data['mautic.lead_post_save_new']) {
        mauticData = data['mautic.lead_post_save_new'][0];
        email = mauticData.contact.fields.core.email.value;
      }
      if(data['mautic.lead_points_change']) {
        mauticData = data['mautic.lead_points_change'][0];
        email = mauticData.contact.fields.core.email.value;
      }
      if(data['mautic.lead_post_save_update']) {
        mauticData = data['mautic.lead_post_save_update'][0];
        email = mauticData.contact.fields.core.email.value;
      }

    } catch (e) {
      sails.log('Invalid Webhook Event');
    }
    if (email === '' && inputs.email) {
      email = inputs.email;
    } else if (email === '') {
      throw 'invalid'
    }


    var Queue = require('bull');
    var userInfoQueue = new Queue('UserInfoQueue', sails.config.jobs.url);

    var cleanupQueue = new Queue('CleanupQueue', sails.config.jobs.url);

    userInfoQueue.on('ready', () => {
      sails.log.info('userInfoQueue ready!');
    });
    userInfoQueue.on('failed', (job, e) => {
      sails.log.info('userInfoQueue failed:', job.id, e);
    });
    userInfoQueue.on('completed', (job, result) => {
      sails.log.info('userInfoQueue job finished:', job.data.email, result)
      cleanupQueue.add(job, {
        jobId: job.id,
        // delete job after one week
        delay: 1000 * 60 * 60 * 24 * 7,
        removeOnComplete: true
      })
    });

    cleanupQueue.process(async job => {
      const userInfoJob = await userInfoQueue.getJob(job.id);
      if (!userInfoJob) {
        return;
      }
      userInfoJob.remove();
    });

    userInfoQueue.process('Update Data to Mautic', 100,async function (job, done) {
      if (job.data.email) {
        let userData = await User.findOne({email: job.data.email})
          .catch((err) => {
            //TODO SOMETHING HERE
            done( null, 'No Such User on ChinesePod')
          });
        if (!userData) {
          //TODO SOMETHING HERE
          done( null, 'No Such User on ChinesePod')
        }
        if (!userData.member_id) {
          userData = await User.updateOne({id:userData.id})
            .set({member_id:job.data.mauticData.contact.id})
        }
        // Check if recently updated
        if (true) {
          let userOptions = await UserOptions.findOne({
            user_id: userData.id,
            option_key: 'level'
          }).catch((err) => {
            //TODO SOMETHING HERE
            done( null, 'No Such User on ChinesePod')
          });
          if (!userOptions) {
            //TODO SOMETHING HERE
            done( null, 'No Such User on ChinesePod')
          }
          let userSiteLinks = await UserSiteLinks.findOne({user_id: userData.id});
          let subscription = 'Free';
          switch (userSiteLinks.usertype_id) {
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

          // TODO CURRENT MAUTIC API UPDATE PROCESS
          const MauticConnector = require('node-mautic');
          const mauticConnector = new MauticConnector({
            apiUrl: 'https://email.chinesepod.com',
            username: 'CpodJsWebsite',
            password: 'zro5YdSykdqYkkgPMBH9yCcGPguGdAbk8IXyjnCW'
          });
          let updatedUser = await mauticConnector.contacts.editContact('PATCH',{
            level: levelText,
            subscription: subscription,
            fullname: userData.name,
            expirydate: userSiteLinks.expiry,
            userid: userData.id
          },userData.member_id);
          if (updatedUser) {
            done(null, 'Updated on Mautic');
          } else {
            done(new Error('User Data could not be pushed to Mautic'))
          }

        } else {
          done(null,'Recently Updated')
        }
      } else {
        done(null, 'Anonymous User');
      }
    });



    userInfoQueue.add('Update Data to Mautic', {
      email: email,
      mauticData: mauticData
    },
      {
        attempts: 2,
        timeout: 180000
      })

  }


};
