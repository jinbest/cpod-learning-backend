module.exports = {


  friendlyName: 'Get word by id',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let userVocab = await UserVocabulary.find({id: inputs.id}).populate('vocabulary_id');

  }


};
