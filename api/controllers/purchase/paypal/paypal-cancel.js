module.exports = {


  friendlyName: 'Paypal Cancel',


  description: 'Cancel paypal.',


  inputs: {

  },


  exits: {

  },


  fn: async function (req,res) {

    res.send("The payment got canceled")

  }


};
