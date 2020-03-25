module.exports = {


  friendlyName: 'View unsubscribe',


  description: 'Display "Unsubscribe" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/email/unsubscribe'
    }

  },


  fn: async function () {


    if (this.req.me && this.req.me.email) {

      return { email: this.req.me.email };

    } else if (this.req.session.limitedAuth && this.req.session.limitedAuth.id) {

      return { email: this.req.session.limitedAuth.email }

    } else {

      return this.res.redirect('/login?continue=/unsubscribe')

    }


  }


};
