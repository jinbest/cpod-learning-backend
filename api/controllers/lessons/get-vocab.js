module.exports = {


  friendlyName: 'Get vocab',


  description: '',


  inputs: {
    lessonId: {
      type: 'string',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    const keyMap = {
      column_1: 's',
      column_2: 'p',
      column_3: 'en',
      column_4: 't'
    };

    let vocab = await Vocabulary.find({v3_id: inputs.lessonId})
      .sort([
        {vocabulary_class: 'ASC'},
        {display_order: 'ASC'}
      ]);
    _.each(vocab, function (item) {
      return _.mapKeys(item, function (value, key) {
        return keyMap[key]
      })
    });
    return vocab
  }
};
