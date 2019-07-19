module.exports = {


  friendlyName: 'Webhook',


  description: 'Webhook something.',


  inputs: {
    'mautic.lead_post_save_new': {
      type: 'ref'
    },
    trigger: {
      type: {}
    }

  },


  exits: {

  },


  fn: async function (req, res) {
    try {
      sails.log(this.req.body['mautic.lead_post_save_new'][0].contact.fields.core.email.value);
    } catch (e) {
      sails.log(e);
    }

  }


};
