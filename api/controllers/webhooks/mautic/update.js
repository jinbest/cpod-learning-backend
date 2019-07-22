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
    try {
      this.req.body.forEach((item) => {
        sails.log([0].contact.fields.core.email.value)
      });
      email = this.req.body[0][0].contact.fields.core.email.value;
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
    userInfoQueue.on('ready', () => {
      sails.log.info('userInfoQueue ready!')
    });
    userInfoQueue.on('failed', (job, e) => {
      sails.log.info('userInfoQueue failed:', job.id, e)
    });
    userInfoQueue.on('completed', (job, result) => {
      sails.log.info('userInfoQueue job finished:', job.data.email, result)
    });
    userInfoQueue.process('Update Data to Mautic', 100,async function (job, done) {
      // console.log(job.data);
      // done('banana');
      if (job.data.email) {
        let userData = await User.findOne({email: job.data.email})
          .catch((err) => {
            done(new Error ('No Such User on ChinesePod'))
          });
        let userOptions = await UserOptions.findOne({
          user_id: userData.id,
          option_key: 'level'
        }).catch((err) => {
          done(new Error ('No Such User on ChinesePod'))
        });
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
        let levelText = 'Newbie';
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

        //TODO CURRENT MAUTIC API UPDATE PROCESS
        // const MauticConnector = require('node-mautic');
        // const mauticConnector = new MauticConnector({
        //   apiUrl: 'https://email.chinesepod.com',
        //   username: 'CpodJsWebsite',
        //   password: 'zro5YdSykdqYkkgPMBH9yCcGPguGdAbk8IXyjnCW'
        // });
        // let contactId = await mauticConnector.contacts.listContacts({search:`email:${job.data.email}`});
        // sails.log.info(contactId.contacts);
        // if (Object.keys(contactId.contacts).length === 1) {
        //   let updatedUser = await mauticConnector.contacts.editContact('PATCH',{
        //     level: level,
        //     subscription: subscription,
        //     fullname: userData.name,
        //     expirydate: userSiteLinks.expiry,
        //     userid: userData.id
        //   },Object.keys(contactId.contacts));
        //   done();
        // } else {
        //   sails.log.error(`Job Failed as user email is not unique - ${job.data.email}`)
        // }
        //TODO SAILS ORM PROCESS

        let updatedContact = await MauticContacts.updateOne({email:job.data.email})
          .set({
            level:levelText,
            subscription: subscription,
            fullname: userData.name,
            expirydate: userSiteLinks.expiry,
            userid: userData.id
          });
        if(updatedContact) {
          done(null,'updated');
        } else {
          MauticContacts.findOrCreate({email:job.data.email},{
            email:job.data.email,
            level:levelText,
            subscription: subscription,
            fullname: userData.name,
            expirydate: userSiteLinks.expiry,
            userid: userData.id
          }).exec(async (err, user, wasCreated) => {
            if (err) {
              sails.log(err);
              done(new Error('Could not update or create'));
            }
            if (wasCreated) {
              done(null,'created')
            }
            if (user) {
              done(new Error('User exists, but could not be updated'))
            }
          });

        }
      } else {
        done(new Error('No User Email provided'));
      }
    });
    userInfoQueue.add('Update Data to Mautic', {email: email})

  }


};
