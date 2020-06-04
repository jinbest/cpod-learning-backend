module.exports = {


  friendlyName: 'Put custom logs',


  description: '',


  inputs: {

    text: {
      type: 'string',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    return await CustomLogs.create(inputs).fetch()

  }


};
