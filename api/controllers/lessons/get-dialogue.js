module.exports = {


  friendlyName: 'Get dialogue',


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
    let rawDialogues = await ContentDialogues.find({v3_id: inputs.lessonId})
      .sort('display_order ASC');

    let dialogueData = [];

    rawDialogues.forEach((dialogue) => {
      dialogue.vocabulary = [];
      dialogue.sentence = [];
      dialogue['row_1'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function(a, b, c, d, e, f, g, h) {
        dialogue.sentence.push({
          en: decodeURI(b),
          p: decodeURI(c),
          s: decodeURI(d),
          t: decodeURI(e)
        });
        if (g) {
          dialogue.sentence.push(decodeURI(g))
        }
        dialogue.vocabulary.push({
          en: b,
          p: c,
          s: d,
          t: e
        })
      });
      dialogueData.push(_.pick(dialogue, ['display_order', 'speaker', 'row_2', 'audio', 'v3_id', 'vocabulary', 'sentence']))
    });

    return dialogueData
  }
};
