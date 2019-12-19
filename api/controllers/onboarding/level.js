module.exports = {


  friendlyName: 'Level Selection',


  description: 'Page to select user level and Character set',


  inputs: {

    level: {
      type: 'string',
      description: 'Level selection for new learners',
    },
    charSet: {
      type: 'string',
      description: 'Simplified or Traditional Characters for learning purposes.',
    }
  },


  exits: {

    success: {
      description: 'Account settings have been updated.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The user not logged in.',
    },

    invalidInputs: {
      responseType: 'badRequest',
      description: 'No inputs provided.',
    },

  },

  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if (!inputs.userId) {
      // this.req.session.userId = 1016995;
      throw 'invalid';
    }

    if(!inputs.level && !inputs.charSet){
      throw 'invalidInputs';
    }

    sails.log.info(inputs);

    let returnData = {};

    let levelValue = 1;
    let levelText = 'newbie';
    if (inputs.level) {
      let level = inputs.level.toLowerCase();
      switch (level) {
        case 'newbie':
          levelValue = 1;
          levelText = 'newbie';
          break;
        case 'elementary':
          levelValue = 2;
          levelText = 'elementary';
          break;
          // Due to an old mistake PreInt === 6
        case 'preint':
          levelValue = 6;
          levelText = 'preint';
          break;
        case 'pre intermediate':
          levelValue = 6;
          levelText = 'preint';
          break;
        case 'pre-intermediate':
          levelValue = 6;
          levelText = 'preint';
          break;
        case 'intermediate':
          levelValue = 3;
          levelText = 'intermediate';
          break;
        case 'upperint':
          levelValue = 4;
          levelText = 'upperint';
          break;
        case 'upper intermediate':
          levelValue = 4;
          levelText = 'upperint';
          break;
        case 'advanced':
          levelValue = 5;
          levelText = 'advanced';
          break;
      }
      returnData.level = await sails.helpers.users.setOption.with({
        userId: inputs.userId,
        type: 'level',
        value: levelValue
      });
      returnData.levels = await sails.helpers.users.setOption.with({
        userId: inputs.userId,
        type: 'levels',
        value: levelText
      });
      returnData.finished = true;
    }
    if (inputs.charSet) {
      returnData.charSet = await sails.helpers.users.setCharSet.with({
        userId: inputs.userId,
        charSet: inputs.charSet.toLowerCase()
      });
      returnData.finished = true;
    }
    sails.log.info({returnData: returnData});
    return returnData
  }
};
