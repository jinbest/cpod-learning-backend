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
    let returnData = [];
    _.each(vocab, function (item) {
      item['s'] = item.column_1;
      item['p'] = item.column_2;
      item['en'] = item.column_3;
      item['t'] = item.column_4;
      returnData.push(_.pick(item, ['s', 't', 'p', 'en', 'audio','vocabulary_class']));
    });
    return returnData
  }
};
