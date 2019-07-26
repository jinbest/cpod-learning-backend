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

    invalidValue: {
      responseType: 'badRequest',
      description: 'Requested settings value is invalid.',
    },
  },

  fn: async function (inputs) {
    if (!inputs.emailAddress && !inputs.userId) {
      throw 'invalid';
    }
    const type = inputs.type.toLowerCase();
    const value = typeof inputs.value  === 'string' ? inputs.value.toLowerCase() : inputs.value;

    const user = inputs.userId ? inputs.userId :
      await User.findOne({
        email: inputs.emailAddress
      });

    if (!user) {
      throw 'invalid';
    }
    let userData = {};
    if (type === 'level') {
      //TODO Helper Set user Level validation
      if (['newbie', 'elementary', 'preInt', 'intermediate', 'upperInt', 'advanced'].includes(inputs.value)) {
        let levelId = 1;
        switch (inputs.value) {
          case 'newbie':
            levelId = 1;
            break;
          case 'elementary':
            levelId = 2;
            break;
          case 'preInt':
            levelId = 6;
            break;
          case 'intermediate':
            levelId = 3;
            break;
          case 'upperInt':
            levelId = 4;
            break;
          case 'advanced':
            levelId = 5;
            break;
        }
        await sails.helpers.users.setOption.with({
          userId: user.id,
          type: 'level',
          value: levelId
        });
        userData = await sails.helpers.users.setOption.with({
          userId: user.id,
          type: 'levels',
          value: inputs.value
        });
        sails.log.info(userData);
      } else if (0 < parseInt(value) && parseInt(value) <= 6) {
        let levelId = parseInt(value);
        let level = 'newbie';
        switch (levelId) {
          case 1:
            level = 'newbie';
            break;
          case 2:
            level = 'elementary';
            break;
          case 6:
            level = 'preInt';
            break;
          case 3:
            level = 'intermediate';
            break;
          case 4:
            level = 'upperInt';
            break;
          case 5:
            level = 'advanced';
            break;
        }
        await sails.helpers.users.setOption.with({
          userId: user.id,
          type: 'level',
          value: levelId
        });
        userData = await sails.helpers.users.setOption.with({
          userId: user.id,
          type: 'levels',
          value: level
        });
      } else {
        throw 'invalidValue';
      }
    } else if (type === 'charSet') {
      //TODO Char Set Logic
    } else {
      userData = await sails.helpers.users.setOption.with({
        userId: user.id,
        type: type,
        value: value
      });
    }
    return userData;
  }
};
