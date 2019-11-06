module.exports = {


  friendlyName: 'List charactercrush users',


  description: '',

  exits: {

    success: {
      viewTemplatePath: 'pages/charactercrush/list-users'
    }

  },


  fn: async function () {

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    };

    const query = `
    SELECT DISTINCT game_logs.user
    FROM game_logs
    WHERE game_logs.user != 'NONE'
    AND game_logs.created_at > $1
    LIMIT 100`;

    sails.log.info(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000));

    let characterCrushUsers = (await GameLogs.getDatastore().sendNativeQuery(query, [new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)])).rows;

    let returnData = [];

    await asyncForEach( characterCrushUsers, async (user) => {
      returnData.push({
        email: user.user,
        lastUse: (await GameLogs.find({
          where: {
            user: user.user
          },
          select: ['createdAt'],
          sort: 'createdAt DESC',
          limit: 1
        }))[0].createdAt
      })
    });

    return {users: returnData.sort((a, b) => b.lastUse.localeCompare(a.lastUse))}
  }
};
