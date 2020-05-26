module.exports = {


  friendlyName: 'Feedback form',


  description: '',


  inputs: {

    data: {
      type: {},
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userData = await User.findOne({id: inputs.userId});
    await UserOptions.updateOrCreate({user_id: inputs.userId, option_key: 'recapBetaFeedback'}, {user_id: inputs.userId, option_key: 'recapBetaFeedback', option_value: JSON.stringify(inputs.data)});

    await sails.helpers.mailgun.sendHtmlEmail.with({
      htmlMessage: `
      <div>New Feedback Received:</div>
      <br/>
      <div>${userData.name} ${userData.email}</div>
      <br/>
      <div>${JSON.stringify(inputs.data)}</div>
      `,
      to: 'feedback@chinesepod.com',
      subject: 'Recap Beta Feedback',
      from: 'team@chinesepod.com',
      fromName: 'ChinesePod Website'
    });
  }


};
