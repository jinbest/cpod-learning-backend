module.exports = {


  friendlyName: 'Create not found log',


  description: '',


  inputs: {

    user_id: {
      type: 'number',
      isInteger: true
    },
    url: {
      type: 'string'
    },
    ip_address: {
      type: 'string'
    },
    user_agent: {
      type: 'string'
    },
    created_at: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    return await NotFoundLogs.create(inputs).fetch();

  }


};

