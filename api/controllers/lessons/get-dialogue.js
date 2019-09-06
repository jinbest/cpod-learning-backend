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
    let speakers = [];

    rawDialogues.forEach((dialogue) => {
      if (dialogue.speaker) {
        speakers.push(dialogue.speaker);
      }
      dialogue.vocabulary = [];
      dialogue.sentence = [];
      dialogue['row_1'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function(a, b, c, d, e, f, g, h) {
        dialogue.sentence.push({
          s: decodeURI(d),
          t: decodeURI(e),
          p: decodeURI(c),
          en: decodeURI(b)
        });
        if (g) {
          dialogue.sentence.push(decodeURI(g))
        }
        dialogue.vocabulary.push({
          s: d,
          t: e,
          p: c,
          en: b
        })
      });
      dialogueData.push(_.pick(dialogue, ['display_order', 'speaker', 'row_2', 'audio', 'v3_id', 'vocabulary', 'sentence']))
    });

    return {
      speakers: speakers,
      dialogue: dialogueData
    }
  }
};
