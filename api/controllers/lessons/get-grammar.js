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
      let grammarBlock = await GrammarBlock
        .findOne({grammar: item.grammar_id})
        .populate('grammar')
        .populate('examples');
      grammarBlock['examples'].forEach((example) => {
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
      });
      sails.log.info(grammarBlock);
      returnData.push(grammarBlock);
    });

    return returnData

  }


};
