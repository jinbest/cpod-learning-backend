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
    SELECT DISTINCT cp_accesslog.accesslog_user
    FROM cp_accesslog
    WHERE cp_accesslog.accesslog_urlbase = 'https://www.chinesepod.com/api/v1/recap/get-lessons'
    AND cp_accesslog.accesslog_user != 'NONE'
    AND cp_accesslog.accesslog_time > $1
    LIMIT 100`;

    sails.log.info(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000));

    let recapUsers = (await Logging.getDatastore().sendNativeQuery(query, [new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)])).rows;

    let returnData = {};

    await asyncForEach(recapUsers, async (user) => {
      returnData[user.accesslog_user] = (await Logging.find({
        where: {
          id: user.accesslog_user,
          accesslog_urlbase: 'https://www.chinesepod.com/api/v1/recap/get-lessons'
        },
        select: ['createdAt'],
        sort: 'createdAt DESC',
        limit: 1
      }))[0].createdAt
    });

    return returnData
  }
};
