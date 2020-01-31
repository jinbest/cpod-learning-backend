module.exports = {


  friendlyName: 'Process bounced',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const geoip = require('geoip-country');

    const eo = require('email-octopus');
    const apiKey = '1ce2c0f8-a142-11e9-9307-06b4694bee2a';

    const emailOctopus = new eo.EmailOctopus(apiKey);

    let campaignList = (await emailOctopus.campaigns.get())['data'];

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    await new Promise(async (resolve, reject) => {
      await asyncForEach(campaignList, async campaign => {

        if(campaign.status === 'SENT') {

          emailOctopus.campaigns.reports.bounced(campaign.id, {limit: 1000})
            .then(async data => {
              let bouncedEmails = data['data'].map(email => email.contact.email_address);
              sails.log.info(bouncedEmails);
              if(bouncedEmails) {
                await User.update({
                  confirm_status: 1,
                  email: {
                    in: bouncedEmails
                  }
                })
                  .set({confirm_status: 0})
              }
              // await asyncForEach(data['data'], async user => {
              //   sails.log.info(`Bounced: ${user.contact.email_address}`);
              //   await User.updateOne({email: user.contact.email_address})
              //     .set({confirm_status: 0})
              // });

            });
        }
      });

      resolve();

    });

  }


};

