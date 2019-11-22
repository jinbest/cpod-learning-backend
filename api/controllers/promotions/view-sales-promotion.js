module.exports = {


  friendlyName: 'View sales promotion',


  description: 'Display "Sales promotion" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/promotions/sales-promotion'
    }

  },

  inputs: {
    code: {
      type: 'string'
    }
  },


  fn: async function (inputs) {

    let expiry = new Date(Date.now() + 4 * 60 * 60 * 1000);

    if (this.req.cookies.event) {
      expiry = new Date(this.req.cookies.event)
    } else {
      this.res.cookie('event', expiry, {
        domain: '.chinesepod.com',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
    }

    // Respond with view.
    return {
      expiry: expiry
    };

  }


};
