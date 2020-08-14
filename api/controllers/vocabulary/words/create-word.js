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
    audio: {
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    let existingVocabulary = (await VocabularyNew
      .find({..._.pick(inputs,['s', 't', 'p']), ...{vocabulary_class: {'nin': ['User Vocabulary', 'Missing Vocabulary']}, audio: {'nin': ['', 'mp3/glossary/source/']}}})
      .sort('id DESC')
      .limit(1))[0]

    sails.log.info(existingVocabulary);

    let newVocab;
    if (existingVocabulary && existingVocabulary.p === inputs.p && existingVocabulary.id) {

      newVocab = existingVocabulary;

    } else {

      //TODO: Improve New Vocab creation process
      newVocab = await VocabularyNew.create({
        ...inputs, ...{
          vocabulary_class: 'User Vocabulary',
          display_order: 1,
          audio: inputs.audio ? inputs.audio : '',
          image: '',
          v3_id: '0000'
        }}).fetch();

    }

    sails.log.info(newVocab)

    await UserVocabulary.updateOrCreate({user_id: inputs.userId, vocabulary_id: newVocab.id});

  }


};
