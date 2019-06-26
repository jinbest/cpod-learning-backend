module.exports = {


  friendlyName: 'Generate Password',


  description: 'Generate passwords according to the nice logic discussed in XKCD',

  inputs: {

    numWords: {
      default: 2,
      type: 'number',
      description: 'Number of words needed.',
    },
  },

  exits: {

    success: {
      outputFriendlyName: 'Password Generated',
      outputDescription: 'Return a generated password',
    }

  },

  fn: async function(inputs) {
    var xkcdPassword = require('xkcd-password');
    var pw = new xkcdPassword();

    var options = {
      numWords: inputs.numWords ? inputs.numWords : 2,
      minLength: 5,
      maxLength: 10,
      wordfile: '../../assets/js/passList.txt'
    };

    let data = await pw.generate(options).then(function (result) {
      return result
    });

    return data.join('-');
  }
};
