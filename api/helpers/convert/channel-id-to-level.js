module.exports = {


  friendlyName: 'Channel id to level',


  description: '',


  inputs: {
    channelId: {
      type: 'number',
      isInteger: true,
      required: true
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    switch (inputs.channelId) {
      case 34:
        return 'newbie';
      case 35:
        return 'elementary';
      case 36:
        return 'intermediate';
      case 37:
        return 'upperInt';
      case 28:
        return 'advanced';
      case 179:
        return 'preInt';
      default:
        return 'mixed';
    }
  }


};

