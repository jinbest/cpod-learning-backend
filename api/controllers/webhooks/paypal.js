module.exports = {


  friendlyName: 'Paypal',


  description: 'Paypal webhooks.',


  inputs: {

  },


  exits: {

  },


  fn: async function (req, res) {

    sails.log.info({paypalWebhook: this.req.body})

  }


};
