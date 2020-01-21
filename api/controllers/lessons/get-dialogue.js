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

    sails.log.info(rawDialogues);

    rawDialogues.forEach((dialogue) => {
      sails.log.info(dialogue);
      if (dialogue.speaker) {
        speakers.push(dialogue.speaker);
      }
      dialogue.vocabulary = [];
      dialogue.sentence = [];
      dialogue['row_1'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function(A, B, C, D, E, F, G, H) {

        let d = ''; let e = ''; let c = ''; let b = ''; let g = '';

        try {d = decodeURI(D)} catch (err) {
          d = D;
          sails.log.error(err)
        }
        try {e = decodeURI(E)} catch (err) {
          e = E;
          sails.log.error(err)
        }
        try {c = decodeURI(C)} catch (err) {
          c = C;
          sails.log.error(err)
        }
        try {b = decodeURI(B)} catch (err) {
          b = B;
          sails.log.error(err)
        }

        dialogue.sentence.push({
          s: d,
          t: e,
          p: c,
          en: b
        });

        if (G) {
          try {g = decodeURI(G)} catch (err) {
            g = G;
            sails.log.error(err)
          }
          dialogue.sentence.push(g)
        }

        dialogue.vocabulary.push({
          s: d ? d : '',
          t: e ? e : '',
          p: c ? c : '',
          en: b ? b : ''
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
