module.exports = {


  friendlyName: 'Generate Random Words',


  description: 'Take length and word count and generate from a pool of random words',


  inputs: {

    complexity: {
      type: 'number',
      description: 'Needed Complexity',
      extendedDescription: `
      There are 6 complexity levels specified which can be used to provide default patterns as well as trigger additional features, such as alternate casing between words and expanded sets of separators.
      Complexity	Pattern	Separators
      1	wsw	#.-=+_
      2	wswsw	#.-=+_
      3	wswswsdd	#.-=+_
      4	wswswswsdd	#.-=+_
      5	wswswswswsd	#.-=+_!$*:~?
      6	ddswswswswswsdd	#.-=+_!$*:~?%^&;
      In addition level 6 alternates upper and lower case between words.
      `
    },
    pattern: {
      type: 'string',
      description: 'Needed Pattern',
      extendedDescription: `
      Patterns can consist of any combination of words, digits and separators. The first letters (w, d and s respectively) are used in pattern string provided to the password generation function.
      For example:
      w will return a single word (i.e. demographics). Use w for lowercase and W for uppercase.
      wsd will return a word and a digit, separated by one of the permitted separators (i.e. storm#7)
      wswsdd will return two words followed by a two digit number, all with separators between (i.e. delates+dissembled+16)
      `
    },
  },


  exits: {

    success: {
      description: 'Word list generated.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'Something went wrong.'
    },

  },

  fn: async function(inputs) {
    var xkpasswd = require('xkpasswd');

    let options = {
      complexity: inputs.complexity ? inputs.complexity : 1,
      separators: '-',
      wordList: __dirname + '/../../assets/json/passList.json'
    };
    if (inputs.pattern) {
      options.pattern = inputs.pattern;
    }
    return xkpasswd(options);
  }
};
