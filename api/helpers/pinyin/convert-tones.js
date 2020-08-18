module.exports = {


  friendlyName: 'Convert tones',


  description: '',


  inputs: {
    pinyinString: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const convert = require('pinyin-tone-converter');

    if (inputs.pinyinString) {
      inputs.pinyinString = inputs.pinyinString
        .replace('\\&#039;', '\'')
        .replace('&#039;', '\'')
        .replace('n5', 'n')
        .replace('r5', 'r')
        .replace('u:1','ǖ')
        .replace('u:2','ǘ')
        .replace('u:3','ǚ')
        .replace('u:4','ǜ')
        .replace('u:5','ü');

      return convert.convertPinyinTones(inputs.pinyinString)
    }
    return ''
  }


};

