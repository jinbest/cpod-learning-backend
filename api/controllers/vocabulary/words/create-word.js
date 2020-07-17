module.exports = {


  friendlyName: 'Create word',


  description: '',


  inputs: {
    s: {
      type: 'string',
      required: true
    },
    t: {
      type: 'string',
      required: true
    },
    p: {
      type: 'string',
      required: true
    },
    en: {
      type: 'string',
      required: true
    },
    lessonId: {
      type: 'string'
    },

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let newVocab = await VocabularyNew.create({
      ...inputs, ...{
      vocabulary_class: 'User Vocabulary',
      display_order: 1,
      audio: "",
      image: "",
      v3_id: inputs.lessonId ? inputs.lessonId : ''
    }}).fetch();

    await UserVocabulary.create({user_id: inputs.userId, vocabulary_id: newVocab.id});

  }


};
