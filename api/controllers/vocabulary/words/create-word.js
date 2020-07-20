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

    let existingVocabulary = (await VocabularyNew
      .find({..._.pick(inputs,['s', 't', 'p']), ...{vocabulary_class: {'!=': 'User Vocabulary'}, audio: {'!=': ''}}})
      .sort('id DESC')
      .limit(1))[0]

    sails.log.info(existingVocabulary);

    let newVocab;
    if (existingVocabulary && existingVocabulary.id) {

       newVocab = existingVocabulary;

    } else {

      newVocab = await VocabularyNew.create({
        ...inputs, ...{
          vocabulary_class: 'User Vocabulary',
          display_order: 1,
          audio: existingVocabulary ? existingVocabulary.audio : '',
          image: existingVocabulary ? existingVocabulary.image : '',
          v3_id: existingVocabulary ? existingVocabulary.v3_id : '0000'
        }}).fetch();

    }

    await UserVocabulary.updateOrCreate({user_id: inputs.userId, vocabulary_id: newVocab.id});

  }


};
