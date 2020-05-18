module.exports = {


  friendlyName: 'Get all decks',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    let userDecks =  await VocabularyTags.find({user_id: inputs.userId});

    let promises = []; let returnData = [];
    userDecks.forEach(deck => {
      promises.push(UserVocabularyToVocabularyTags.count({vocabulary_tag_id: deck.id})
        .then((data) => {
          returnData.push(
            {...deck,...{count:data}}
          )}))
    })

    await Promise.all(promises);

    return returnData
  }


};
