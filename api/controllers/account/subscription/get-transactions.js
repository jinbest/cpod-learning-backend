module.exports = {


  friendlyName: 'Get info',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    return await Transactions.find({user_id: inputs.userId}).sort('createdAt DESC')

  }


};
