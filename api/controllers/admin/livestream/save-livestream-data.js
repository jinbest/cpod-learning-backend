module.exports = {


  friendlyName: 'Save livestream data',


  description: '',


  inputs: {
    id: {
      type: 'number',
      isInteger: true
    },
    title: {
      type: 'string',
      required: true
    },
    level: {
      type: 'string',
      required: true
    },
    startTime: {
      type: 'string',
      required: true
    },
    promoteFrom: {
      type: 'string',
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    if (inputs.id) {

      return await Livestream.updateOne({id: inputs.id}).set(inputs);

    } else {

      return await Livestream.create(inputs).fetch();

    }

  }


};
