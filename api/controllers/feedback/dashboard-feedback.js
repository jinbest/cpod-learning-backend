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

    if (this.req.session.userId) {
      inputs.userId = this.req.session.userId;
    }

    try {

      await sails.helpers.mailgun.sendHtmlEmail.with({
        htmlMessage: `
            ${inputs.wantsResponse ? '<p>USER WANTS TO HEAR BACK</p>' : ''}
            ${inputs.wantsToParticipate ? '<p>USER WANTS TO BETA TEST</p>' : ''}
            <br />
            <p>User has submitted feedback on the New ChinesePod Dashboard</p>
            <br />
            <p>Name: ${inputs.name}</p>
            <p>Email: ${inputs.email}</p>
            <br />
            <p>Feedback: ${inputs.feedback}</p>
            <p>Likely to Switch: ${inputs.likelyToSwitch}</p>            
            <br />
            <p>Comments: ${inputs.comments}</p>            
            <br />
            <p>How User Studies: ${inputs.howToStudy}</p>           
            <br />
            <p>Primary Device: ${inputs.primaryDevice === 'other' ? inputs.primaryDevice : inputs.other}</p>
            <br />
            <p>Cheers,</p>
            <p>The Friendly ChinesePod Contact Robot</p>
            `,
        to: 'feedback@chinesepod.com',
        subject: 'ChinesePod Dashboard Feedback',
        from: 'feedback@chinesepod.com',
        fromName: 'ChinesePod Feedback'
      });

      await FeedbackForms.create(inputs);

    } catch (e) {
      sails.log.error({inputs: inputs});
      sails.hooks.bugsnag.notify(e)
    }

  }


};
