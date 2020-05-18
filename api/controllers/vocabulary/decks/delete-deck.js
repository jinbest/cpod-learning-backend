module.exports = {


  friendlyName: 'Delete deck',


  description: '',


  inputs: {
    id: {
      type: 'number',
      isInteger: true
    }

  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    },
    unauthorized: {
      responseType: 'unauthorized'
    }

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let deck = await VocabularyTags.findOne({id: inputs.id});

    if (!deck) {
      throw 'invalid'
    } else if (deck.user_id !== inputs.userId) {
      throw 'unauthorized'
    }

    await UserVocabularyToVocabularyTags.destroy({vocabulary_tag_id: inputs.id})
    await VocabularyTags.destroyOne({id: inputs.id});

    return;

  }


};
