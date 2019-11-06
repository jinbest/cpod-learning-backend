module.exports = {


  friendlyName: 'List recap users',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    const groupBy = key => array =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});

    const groupByEmail = groupBy('id');

    const query = `
    SELECT DISTINCT game_logs.user
    FROM game_logs
    WHERE game_logs.user != 'NONE'
    AND game_logs.created_at > $1
    LIMIT 100`;

    sails.log.info(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000));

    let characterCrushUsers = (await GameLogs.getDatastore().sendNativeQuery(query, [new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)])).rows;

    let returnData = {};

    await asyncForEach( characterCrushUsers, async (user) => {
      returnData[user.user] = (await GameLogs.find({
        where: {
          user: user.user
        },
        select: ['createdAt'],
        sort: 'createdAt DESC',
        limit: 1
      }))[0].createdAt
    });

    return returnData
  }
};
