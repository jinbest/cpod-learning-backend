module.exports = {


  friendlyName: 'Add Sentence',


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
    audio: {
      type: 'string'
    },
    image: {
      type: 'string'
    },
    lessonId: {
      type: 'string'
    },

  },


  exits: {

  },


  fn: async function (inputs) {

    const convert = require('pinyin-tone-converter');

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    inputs.p = convert.convertPinyinTones(inputs.p);

    let newVocab = await VocabularyNew.create({
      ...inputs, ...{
        vocabulary_class: 'User Sentence',
        display_order: 1,
        image: inputs.image ? inputs.image : '',
        audio: inputs.audio ? inputs.audio : '',
        v3_id: inputs.lessonId ? inputs.lessonId : ''
      }}).fetch();

    await UserVocabulary.create({user_id: inputs.userId, vocabulary_id: newVocab.id});

  }


};
