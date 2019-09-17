module.exports = {


  friendlyName: 'Get expansion',


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
    const groupBy = key => array =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});

    const groupByVocab = groupBy('vocabulary');

    // All done.
    let rawExpansions = await ContentExpansions.find({v3_id: inputs.lessonId})
      .select(['vocabulary', 'row_1', 'row_2', 'audio'])
      .sort('display_order ASC');

    rawExpansions.forEach((expansion) => {
      expansion.sentence = [];
      expansion['row_1'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function (a, b, c, d, e, f, g, h) {
        expansion.sentence.push({
          s: decodeURI(d),
          t: decodeURI(e),
          p: decodeURI(c),
          en: decodeURI(b)
        });
        if (g) {
          expansion.sentence.push(decodeURI(g))
        }
      });
    });
    return groupByVocab(rawExpansions);
  }


};
