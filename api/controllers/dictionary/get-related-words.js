module.exports = {


  friendlyName: 'Get dictionary word',


  description: '',


  inputs: {
    simplified: {
      type: 'string'
    },
    traditional: {
      type: 'string'
    },
    traditional: {
      type: 'string'
    },

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {

    if (!inputs) {
      throw 'invalid'
    }

    const ccedict = require('../../../lib/cedict.json');

    if(inputs.simplified) {
      return ccedict.filter((word) => word.simplified.slice(0, inputs.simplified.length) === inputs.simplified)
    }
    if(inputs.traditional) {
      return ccedict.filter((word) => word.traditional.slice(0, inputs.traditional.length) === inputs.traditional)
    }

  }


};
