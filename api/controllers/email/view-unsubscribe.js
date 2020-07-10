module.exports = {


  friendlyName: 'View unsubscribe',


  description: 'Display "Unsubscribe" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/email/unsubscribe'
    }

  },


  fn: async function () {

    function toObject(arr) {
      var rv = {};
      arr.forEach(option => {
        rv[option.option_key] = option.option_value
      });
      return rv;
    }

    const emailPreferences = {
      'subscribedPromotions': true,
      'subscribedAcademic': true,
      'subscribedWeeklyNewLessons': true,
      'subscribedWordOfTheDay': true,
      'betaNotifications': true,
      'betaNotificationsIOS': false,
      'betaNotificationsAndroid': false,
    };

    const accountSettings = [
      'levelInterests',
      'charSet',
      'notInterestedInCharacters'
    ];

    let email; let userOptions;

    if (this.req.me && this.req.me.email && this.req.session.userId) {

      userOptions = await UserOptions.find({user_id: this.req.session.userId, option_key: {in: ['emailPreferences', ...accountSettings]}});
      email = this.req.me.email;

    } else if (this.req.session.limitedAuth && this.req.session.limitedAuth.id) {

      userOptions = await UserOptions.find({user_id: this.req.session.limitedAuth.id, option_key: {in: ['emailPreferences', ...accountSettings]}});
      email = this.req.session.limitedAuth.email;

    } else {

      return this.res.redirect('/login?continue=/unsubscribe')

    }

    let emailOptions = {};
    let parsedOptions = toObject(userOptions);
    let parsedPreferences = toObject(userOptions.filter(option => accountSettings.includes(option.option_key)));

    if (parsedOptions.emailPreferences) {
      emailOptions = JSON.parse(parsedOptions.emailPreferences);
    } else {
      emailOptions = emailPreferences
    }

    if (parsedPreferences.levelInterests) {
      parsedPreferences.levelInterests = JSON.parse(parsedPreferences.levelInterests);
    } else {
      parsedPreferences.levelInterests = {
        newbie: false,
        intermediate: false,
        advanced: false
      }
    }

    return {
      email: email,
      formData: {
        options: emailOptions,
        preferences: parsedPreferences
      }
    }

  }


};
