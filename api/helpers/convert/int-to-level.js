module.exports = {


  friendlyName: 'Int to level',


  description: '',


  inputs: {
    levelId: {
      type: 'number',
      isInteger: true
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    switch (inputs.levelId) {
      case 1:
        return 'newbie';
      case 2:
        return 'elementary';
      case 6:
        return 'preInt';
      case 3:
        return 'intermediate';
      case 4:
        return 'upperInt';
      case 5:
        return 'advanced';
      default:
        return 'newbie'
    }
  }


};

