module.exports = {


  friendlyName: 'Unsubscribe logged in',


  description: '',


  inputs: {
    unsubscribeAll: {
      type: 'boolean'
    },
    options: {
      type: {}
    },
    preferences: {
      type: {},
    },

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

    if (inputs.unsubscribeAll) {

      await MailingDoNotContact.updateOrCreate({user_id: inputs.userId}, {
        user_id: inputs.userId,
        reason: 'Website Unsubscribe Button'
      });

    } else if (inputs.options && inputs.preferences) {

      let promises = [];
      promises.push(
        UserOptions.updateOrCreate(
        {user_id: inputs.userId, option_key: 'emailPreferences'},
        {user_id: inputs.userId, option_key: 'emailPreferences', option_value: JSON.stringify(inputs.options)}
        )
      );

      promises.push(
        UserOptions.updateOrCreate(
          {user_id: inputs.userId, option_key: 'levelInterests'},
          {user_id: inputs.userId, option_key: 'levelInterests', option_value: JSON.stringify(inputs.preferences.levelInterests)}
        )
      );

      promises.push(
        UserOptions.updateOrCreate(
          {user_id: inputs.userId, option_key: 'charSet'},
          {user_id: inputs.userId, option_key: 'charSet', option_value: inputs.preferences.charSet}
        )
      );

      if(inputs.preferences.hasOwnProperty('notInterestedInCharacters')) {
        promises.push(
          UserOptions.updateOrCreate(
            {user_id: inputs.userId, option_key: 'notInterestedInCharacters'},
            {user_id: inputs.userId, option_key: 'notInterestedInCharacters', option_value: inputs.preferences.notInterestedInCharacters}
          )
        );
      }

      await Promise.all(promises);

    }

  }

};
