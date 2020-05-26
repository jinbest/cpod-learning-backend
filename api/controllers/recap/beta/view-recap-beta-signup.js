module.exports = {


  friendlyName: 'View recap',


  description: 'Display "Recap" page.',

  inputs: {},

  exits: {

    // success: {
    //   viewTemplatePath: 'pages/recap/beta/signup'
    // }

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userOptions = await UserOptions.findOne({user_id: inputs.userId, option_key: 'recapBetaSignup'})

    if (userOptions) {
      return this.res.redirect('/recap-beta/feedback')
    }

    return this.res.view('pages/recap/beta/signup', {
      layout: false
    })

  }


};
