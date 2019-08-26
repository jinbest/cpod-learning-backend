module.exports = {


  friendlyName: 'Get stats',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userOptions = await UserOptions.findOne({user_id: inputs.userId, option_key: 'level'});

    return {
      userId: inputs.userId,
      progress: {
        current: 67,
        target: 15
      },
      level: await sails.helpers.convert.intToLevel(userOptions.option_value),
      monthViewed: '',
      monthStudied: ''
    };
  }
};
