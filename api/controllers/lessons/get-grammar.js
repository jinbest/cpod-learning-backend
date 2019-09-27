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
          example['source_annotate'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function (a, b, c, d, e, f, g, h) {
            example.sentence.push({
              s: decodeURI(d),
              t: decodeURI(e),
              p: decodeURI(c),
              en: decodeURI(b)
            });
            if (g) {
              example.sentence.push(decodeURI(g))
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
