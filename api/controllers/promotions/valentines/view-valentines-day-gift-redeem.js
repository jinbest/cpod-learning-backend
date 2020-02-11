module.exports = {


  friendlyName: 'View valentines day gift redeem',


  description: 'Display "Valentines day gift redeem" page.',

  inputs: {
    code: {
      type: 'string'
    },
    userCode: {
      type: 'string'
    }
  },

  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/valentines/valentines-day-gift-redeem'
    }

  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    if(this.req.session.userId) {

      //TODO

    } else if (inputs.userCode) {

      //TODO

      let userData = await User.findOne({code: inputs.userCode});

      sails.log.info(userData);

      if (!userData) {

        return this.res.redirect(`/valentines-day-gift-redeem${inputs.code ? `/${inputs.code}` : ''}`)

      }

      this.req.session.userId = userData.id

    } else {

      return this.res.redirect('/login?continue=' + `/valentines-day-gift-redeem${inputs.code ? `/${inputs.code}` : ''}`)

    }



    return {
      formData: {code:  inputs.code}
    };

  }


};
