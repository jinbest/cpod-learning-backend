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
    let userId = '';
    let data = this.req.body;
    let mauticData ={};
    try {
      if(data['mautic.lead_channel_subscription_changed']) {
        mauticData = data['mautic.lead_channel_subscription_changed'][0];
        email = mauticData.contact.fields.core.email.value;
        userId = mauticData.contact.fields.core.userid.value;
      }
      if(data['mautic.lead_post_save_new']) {
        mauticData = data['mautic.lead_post_save_new'][0];
        email = mauticData.contact.fields.core.email.value;
        userId = mauticData.contact.fields.core.userid.value;
      }
      if(data['mautic.lead_points_change']) {
        mauticData = data['mautic.lead_points_change'][0];
        email = mauticData.contact.fields.core.email.value;
        userId = mauticData.contact.fields.core.userid.value;
      }
      if(data['mautic.lead_post_save_update']) {
        mauticData = data['mautic.lead_post_save_update'][0];
        email = mauticData.contact.fields.core.email.value;
        userId = mauticData.contact.fields.core.userid.value;
      }

    } catch (e) {
      sails.log.error('Invalid Webhook Event');
    }

    if (email === '' && inputs.email) {
      email = inputs.email;
    } else if (email === '') {
      return
    }

    let userData = {};
    if (email) {
      userData.email = email;
    }
    if (userId) {
      userData.userId = userId;
    }
    if (!mauticData === {}) {
      userData.mauticData = mauticData;
    }

    if (!userData.email && !userData.userId) {
      return
    } else {
      sails.hooks.jobs.userInfoQueue.add('Update Data to Mautic',
        userData,
        {
          attempts: 2,
          timeout: 180000
        })

    }
  }


};
