module.exports = {


  friendlyName: 'Set option',


  description: '',


  inputs: {

    userId: {
      type: 'number',
      description: 'User ID from the Database',
    },
    type: {
      required: true,
      type: 'string',
      description: 'Name of the setting to update. Accepts free-form inputs',
    },
    value: {
      required: true,
      type: 'string',
      description: 'Takes corresponding setting value',
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },
    invalid: {
      description: 'The provided ID does not match a valid user.'
    },

  },


  fn: async function (inputs) {
    // TODO
    let valuesToSet = {
      user_id: inputs.userId,
      option_key: inputs.type,
      option_value: inputs.value
    };

    let currentData = await UserOptions.findOne({
      user_id: inputs.userId,
      option_key: inputs.type
    });

    let newData = {};

    if (!currentData) {
      newData = await UserOptions.create(valuesToSet).fetch()
    } else {
      newData = await UserOptions.updateOne({id: currentData.id})
        .set(valuesToSet)
    }

    return newData;

  }
};

