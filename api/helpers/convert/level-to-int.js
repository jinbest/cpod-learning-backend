module.exports = {


  friendlyName: 'Level to int',


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
        return 1;
      case 'elementary':
        return 2;
      case 'preInt':
        return 6;
      case 'intermediate':
        return 3;
      case 'upperInt':
        return 4;
      case 'advanced':
        return 5;
    }
  }


};

