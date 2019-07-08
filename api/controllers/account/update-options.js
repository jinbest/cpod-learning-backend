module.exports = {


  friendlyName: 'Update User Settings',


  description: 'Update Settings for the specific user.',


  inputs: {

    userId: {
      required: true,
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
      description: 'User setting set successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided ID does not match a valid user.'
    },

    invalidType: {
      responseType: 'badRequest',
      description: 'Requested settings type does not exist.',
    },

  },

  fn: async function (inputs) {
    const userId = inputs.userId;
    const type = inputs.type.toLowerCase();
    const value = typeof inputs.value  === 'string' ? inputs.value.toLowerCase() : inputs.value;

    var valuesToSet = {
      user_id: userId,
      option_key: type,
      option_value: value
    };

    let response = {};

    await UserOptions.findOrCreate({
      user_id: userId,
      option_key: type
    },valuesToSet)
      .exec(async(err, userOptions, wasCreated) => {
        if (err) { throw 'invalid' }
        if (wasCreated) {
          response = userOptions;
        } else {
          valuesToSet.id = userOptions.id;
          await UserOptions.updateOne({id: userOptions.id})
            .set(valuesToSet);
          response = userOptions;
        }
      });
    return response;
  }
};
