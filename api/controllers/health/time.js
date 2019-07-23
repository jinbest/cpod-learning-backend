module.exports = {


  friendlyName: 'Server Time Information',


  description: 'Returns Server Time',


  exits: {

    success: {
      description: 'Time sent successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided ip address is invalid.'
    },

  },

  fn: async function () {
    return new Date();
  }
};
