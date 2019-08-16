module.exports = {


  friendlyName: 'One level higher',


  description: '',


  inputs: {
    level: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    switch (inputs.level) {
      case 'newbie':
        return 'elementary';
      case 'elementary':
        return 'preInt';
      case 'preInt':
        return 'intermediate';
      case 'intermediate':
        return 'upperInt';
      case 'upperInt':
        return 'advanced';
      case 'advanced':
        return 'media';
    }
  }


};

