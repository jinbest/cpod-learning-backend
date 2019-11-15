module.exports = {


  friendlyName: 'Dashboard feedback',


  description: '',


  inputs: {
    name: {
      type: 'string',
      allowNull: true
    },
    email: {
      type: 'string',
      isEmail: true,
      allowNull: true
    },
    feedback: {
      type: 'string',
      allowNull: true
    },
    likelyToSwitch: {
      type: 'string',
      allowNull: true
    },
    comments: {
      type: 'string',
      allowNull: true
    },
    howToStudy: {
      type: 'string',
      allowNull: true
    },
    primaryDevice: {
      type: 'string',
      allowNull: true
    },
    other: {
      type: 'string',
      allowNull: true
    },
    wantsResponse: {
      type: 'boolean',
      allowNull: true
    },
    wantsToParticipate: {
      type: 'boolean',
      allowNull: true
    },

  },


  exits: {

  },


  fn: async function (inputs) {

    if (this.res.me && this.res.me.id) {
      inputs.userId = this.res.me.id
    }

    try {
      await FeedbackForms.create(inputs);
    } catch (e) {
      sails.log.error({inputs: inputs});
      sails.hooks.bugsnag.notify(e)
    }

  }


};
