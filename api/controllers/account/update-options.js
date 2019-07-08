module.exports = {


  friendlyName: 'Update User Settings',


  description: 'Update Settings for the specific user.',


  inputs: {

    userId: {
      type: 'number',
      description: 'User ID from the Database',
    },
    emailAddress: {
      type: 'string',
      isEmail: true,
      description: 'The email address of the user account, e.g. m@example.com.',
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
      description: 'The provided ID or email does not match a valid user.'
    },

    invalidType: {
      responseType: 'badRequest',
      description: 'Requested settings type does not exist.',
    },

  },

  fn: async function (inputs) {
    if (!inputs.emailAddress && !inputs.userId) {
      throw 'invalid';
    }
    const type = inputs.type.toLowerCase();
    const value = typeof inputs.value  === 'string' ? inputs.value.toLowerCase() : inputs.value;

    const userId = inputs.userId ? inputs.userId :
      await User.findOne({
        email: inputs.emailAddress
      });

    if (!userId) {
      throw 'invalid';
    }

    let valuesToSet = {
      user_id: userId,
      option_key: type,
      option_value: value
    };

    let userData = await UserOptions.findOrCreate({
      user_id: userId,
      option_key: type
    },valuesToSet)
      .exec(async(err, userOptions, wasCreated) => {
        if (err) { throw 'invalid' }
        if (wasCreated) {
        } else {
          valuesToSet.id = userOptions.id;
          await UserOptions.updateOne({id: userOptions.id})
            .set(valuesToSet);
        }
        return userOptions
      });
    return userData;
  }
};
