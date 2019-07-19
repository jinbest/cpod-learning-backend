module.exports = {


  friendlyName: 'Webhook',


  description: 'Webhook something.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log(this.req.mautic.lead_post_save_new);
    sails.log(this.req.contact);
    // All done.
    sails.log(inputs);

  }


};
