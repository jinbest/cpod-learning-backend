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
    if (!inputs) {
      try {
        let newUser = this.req.body['mautic.lead_post_save_new'][0].contact.fields.core.email.value;
        await sails.helpers.mautic.update.with({
          email: newUser
        })
      } catch (e) {
        sails.log('Invalid Webhook Event');
      }
    } else if (inputs.email) {
      await sails.helpers.mautic.update.with({
        email: inputs.email
      })
    } else {
      throw 'invalid'
    }


  }


};
