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
      description: 'The options are invalid.',
    },

  },

  fn: async function (inputs) {
    let level = inputs.level.toLowerCase();
    let charSet = inputs.charSet.toLowerCase();
    let levelValue = 1;
    if (level) {
      switch (level) {
        case 'newbie':
          levelValue = 1;
          break;
        case 'elementary':
          levelValue = 2;
          break;
          // Due to an old mistake PreInt = 6
        case 'preInt':
          levelValue = 6;
          break;
        case 'intermediate':
          levelValue = 3;
          break;
        case 'upperInt':
          levelValue = 4;
          break;
        case 'advanced':
          levelValue = 5;
          break;
      }
      await sails.helpers.updateOptions.with({
        userId: this.req.session.userId,
        type: 'level',
        value: levelValue
      });
      await sails.helpers.updateOptions.with({
        userId: this.req.session.userId,
        type: 'levels',
        value: level.toUpperCase()
      });
    }
    if (charSet) {
      await sails.helpers.updateOptions.with({
        userId: this.req.session.userId,
        type: 'charSet',
        value: charSet.toUpperCase()
      });
    }
    return;
  }
};
