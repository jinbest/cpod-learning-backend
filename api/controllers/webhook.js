module.exports = {


  friendlyName: 'Webhook',


  description: 'Webhook something.',


  inputs: {

  },


  exits: {

  },


  fn: async function (req, res) {
    try {
      sails.log(this.req.body['mautic.lead_post_save_new']);
    } catch (e) {
      sails.log(e);
    }

  }


};
