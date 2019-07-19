module.exports = {


  friendlyName: 'Webhook',


  description: 'Webhook something.',


  inputs: {

  },


  exits: {

  },


  fn: async function (req, res) {

    sails.log(Object.keys(this.req.body))

  }


};
