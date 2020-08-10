module.exports = {


  friendlyName: 'Generate Password',


  description: 'Generate passwords according to the nice logic discussed in XKCD',

  inputs: {

    complexity: {
      default: 1,
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
      default: 'wsw',
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
      outputFriendlyName: 'Password Generated',
      outputDescription: 'Return a generated password',
    }

  },

  fn: async function(inputs) {
    var randomWords = require('random-words');

    // let options = {
    //   complexity: inputs.complexity ? inputs.complexity : 1,
    //   separators: '-',
    //   wordList: __dirname + '/../../assets/json/passList.json'
    // };
    //

    if (inputs.pattern) {

      let randomWord = '';

      while (randomWord.length < 6) {
        randomWord = randomWords();
      }

      return randomWord

    } else {

      return randomWords({exactly: 2, join: '-'})

    }

  }
};
