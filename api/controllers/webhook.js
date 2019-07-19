module.exports = {


  friendlyName: 'Webhook',


  description: 'Webhook something.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    sails.log(this.req);

  }


};
