module.exports = {


  friendlyName: 'Calculate user greeting',


  description: '',


  inputs: {
    userId: {
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
    const firstNames = require('../../../lib/firstNames');

    let userData = await User.findOne({id: inputs.userId});

    if (userData.name && userData.name.split(' ').length > 1) {
      let firstName = userData.name.split(' ')[0];

      if (firstName) {
        firstName = _.capitalize(firstName);
        if (firstNames.includes(firstName)) {
          return `Hello ${firstName},`
        }
      }
    }

    return 'Nĭ hăo,'

  }


};

