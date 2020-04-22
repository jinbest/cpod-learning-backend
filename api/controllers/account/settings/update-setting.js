module.exports = {


  friendlyName: 'Update setting',


  description: '',


  inputs: {

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

    invalid: {
      responseType: 'badRequest',
      description: 'The provided ID or email does not match a valid user.'
    },
  },


  fn: async function (inputs) {
    try {
      inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;
    } catch (e) {
      throw 'invalid';
    }

    await UserOptions.updateOrCreate({user_id: inputs.userId, option_key: inputs.type},{user_id: inputs.userId, option_key: inputs.type, option_value: inputs.value})

  }


};
