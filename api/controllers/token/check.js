module.exports = {


  friendlyName: 'Check',


  description: 'Check token.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    return this.req.me;

  }


};
