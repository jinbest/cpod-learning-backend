module.exports = {


  friendlyName: 'Generate',


  description: 'Generate access codes.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    return await AccessVoucherCodes.create(inputs).fetch();

  }


};
