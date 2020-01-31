module.exports = {


  friendlyName: 'Process inactive',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    return await sails.helpers.email.processChurned();

  }


};
