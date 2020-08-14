module.exports = {


  friendlyName: 'Get grammar',


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

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    const grammarIds = (await ContentGrammarTag.find({v3_id: inputs.lessonId}));

    let returnData = [];

    await asyncForEach(grammarIds, async (item) => {
      let grammarBlocks = await GrammarBlock
        .find({grammar: item.grammar_id})
        .populate('grammar')
        .populate('examples');
      grammarBlocks.forEach((block) => {
        block['examples'].forEach((example) => {
          example.sentence = [];

          example['en'] = example['target'];

          example.p = '';
          example.s = '';
          example.t = '';

          example['source_annotate'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function (A, B, C, D, E, F, G, H) {

            let d = ''; let e = ''; let c = ''; let b = ''; let g = '';

            try {d = decodeURI(D)} catch (err) {
              d = D;
            }
            try {e = decodeURI(E)} catch (err) {
              e = E;
            }
            try {c = decodeURI(C)} catch (err) {
              c = C;
            }
            try {b = decodeURI(B)} catch (err) {
              b = B;
            }

            example.sentence.push({
              s: d,
              t: e,
              p: c,
              en: b
            });

            example.p += c + ' ';
            example.s += d;
            example.t += e;

            if (G) {
              try {g = decodeURI(G)} catch (err) {
                g = G;
              }
              example.sentence.push(g);
              example.p += g;
              example.s += g;
              example.t += g;
            }
          });
        })
      });
      sails.log.info(grammarBlocks);
      grammarBlocks.forEach((block) => returnData.push(block));
    });

    return returnData

  }


};
