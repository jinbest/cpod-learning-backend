module.exports = {


  friendlyName: 'Delete livestream data',


  description: '',


  inputs: {
    livestreamId: {
      type: 'number',
      isInteger: true,
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    return await Livestream.destroyOne({id: inputs.livestreamId})

  }


};
