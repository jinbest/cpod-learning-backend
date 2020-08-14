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
      expansion['target'] = expansion['row_2'];
      expansion['en'] = expansion['row_2'];
      expansion.p = '';
      expansion.s = '';
      expansion.t = '';
      expansion['row_1'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function (A, B, C, D, E, F, G, H) {

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

        expansion.sentence.push({
          s: d,
          t: e,
          p: c,
          en: b
        });

        expansion.p += c + ' ';
        expansion.s += d;
        expansion.t += e;

        if (G) {
          try {g = decodeURI(G)} catch (err) {
            g = G;
          }
          expansion.sentence.push(g);
          expansion.p += g;
          expansion.s += g;
          expansion.t += g;
        }
      });

      delete expansion['row_1'];
      delete expansion['row_2'];
    });
    let groupedData = groupByVocab(rawExpansions);
    let returnData = [];
    Object.keys(groupedData).forEach((expansion) => {
      returnData.push({
        phrase: expansion,
        examples: groupedData[expansion]
      })
    });
    return returnData
  }


};
