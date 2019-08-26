module.exports = {


  friendlyName: 'Notifications',


  description: 'Notifications dashboard.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;
    // All done.
    return;

  }


};
