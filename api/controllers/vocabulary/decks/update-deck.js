module.exports = {


  friendlyName: 'Update deck',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    tag: {
      type: 'string',
      maxLength: 255,
      required: true
    },
    public: {
      type: 'boolean'
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

    return await VocabularyTags.updateOne({id: deck.id}).set(inputs)

  }


};
