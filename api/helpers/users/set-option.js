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
      responseType: 'badRequest',
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
    return await UserOptions.findOrCreate({
      user_id: inputs.userId,
      option_key: inputs.type
    },valuesToSet)
      .exec(async(err, userOptions, wasCreated) => {
        if (err) { throw 'invalid' }
        if (wasCreated) {
        } else {
          valuesToSet.id = userOptions.id;
          userOptions = await UserOptions.updateOne({id: userOptions.id})
            .set(valuesToSet);
        }
        return userOptions
      })
  }


};

