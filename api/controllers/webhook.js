module.exports = {


  friendlyName: 'Webhook',


  description: 'Webhook something.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    try {
      sails.log(this.req.mautic.lead_post_save_new);
    } catch (e) {

    }
    try {
      sails.log(this.req.contact);
    } catch (e) {

    }
    try {
      sails.log(this.req.data);
    } catch (e) {

    }
    // All done.
    sails.log(inputs);

  }


};
