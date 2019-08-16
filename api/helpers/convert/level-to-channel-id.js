module.exports = {


  friendlyName: 'Level to channel id',


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
        return 34;
      case 'elementary':
        return 35;
      case 'intermediate':
        return 36;
      case 'upperInt':
        return 37;
      case 'advanced':
        return 38;
      case 'preInt':
        return 179;
      default:
        return '34';
    }
  }


};

