module.exports = {


  friendlyName: 'View dictionary',


  description: 'Display "Dictionary" page.',

  inputs: {
    query: {
      type: 'string'
    }
  },

  exits: {

    success: {
      viewTemplatePath: 'pages/dictionary'
    }

  },


  fn: async function (inputs) {

    // Respond with view.

    let data = {};

    if (inputs.query) {
      data = await sails.helpers.dictionary.searchWord(inputs.query)
    }

    return {
      definition: data.definition ? data.definition : false,
      multiDefinition: data.multiDefinition ? data.multiDefinition : false,
      dictionary: data.dictionary ? data.dictionary : false,
      examples: data.examples ? data.examples : false,
      sentences: data.sentences ? data.sentences : false
    }

  }

};
