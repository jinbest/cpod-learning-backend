module.exports = {


  friendlyName: 'View not found logs',


  description: 'Display "Not found logs" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/admin/not-found-logs'
    }

  },


  fn: async function () {

    let returnData;

    try {
      returnData = (await NotFoundLogs.getDatastore().sendNativeQuery(`
      SELECT url, count(*) as count
      FROM chinesepod_logging.not_found_logs
      WHERE created_at > '${new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()}'
      ORDER BY count DESC;`))['rows'];
    } catch (e) {
      returnData = [];
    }

    return {data: returnData}

  }


};
