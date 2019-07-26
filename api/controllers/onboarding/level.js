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
    if (!this.req.session.userId) {
      // this.req.session.userId = 1016995;
      throw 'invalid';
    }

    if(!inputs.level && !inputs.charSet){
      throw 'invalidInputs';
    }

    let levelValue = 1;
    if (inputs.level) {
      let level = inputs.level.toLowerCase();
      switch (level) {
        case 'newbie':
          levelValue = 1;
          break;
        case 'elementary':
          levelValue = 2;
          break;
          // Due to an old mistake PreInt === 6
        case 'preint':
          levelValue = 6;
          break;
        case 'intermediate':
          levelValue = 3;
          break;
        case 'upperint':
          levelValue = 4;
          break;
        case 'advanced':
          levelValue = 5;
          break;
      }
      await sails.helpers.users.setOption.with({
        userId: this.req.session.userId,
        type: 'level',
        value: levelValue
      });
      await sails.helpers.users.setOption.with({
        userId: this.req.session.userId,
        type: 'levels',
        value: level.toLowerCase()
      });
    }
    if (inputs.charSet) {
      await sails.helpers.users.setCharSet.with({
        userId: this.req.session.userId,
        charSet: inputs.charSet.toLowerCase()
      });
    }
  }
};
