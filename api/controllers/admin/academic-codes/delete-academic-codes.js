module.exports = {


  friendlyName: 'Delete',


  description: 'Delete access codes.',


  inputs: {
    voucherId: {
      type: 'number',
      isInteger: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    return AccessAcademicCodes.destroyOne({id: inputs.voucherId})

  }


};
