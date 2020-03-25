module.exports = {


  friendlyName: 'Unsubscribe logged in',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = '';

    if (this.req.session.userId) {
      inputs.userId = this.req.session.userId;
    } else if(this.req.session.limitedAuth && this.req.session.limitedAuth.id) {
      inputs.userId = this.req.session.limitedAuth.id
    }

    await MailingDoNotContact.updateOrCreate({user_id: inputs.userId}, {
      user_id: inputs.userId,
      reason: 'Website Unsubscribe Button'
    });

    // All done.
    return;

  }


};
