module.exports = {


  friendlyName: 'View Relevant Recap Lessons',


  description: 'Display "Recap lessons" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/secret-page'
    }

  },


  fn: async function () {

    let sql = `
    SELECT DISTINCT log.accesslog_user, log.accesslog_url, u.ltv
    FROM chinesepod_logging.cp_accesslog log
    LEFT JOIN chinesepod_production.users u ON log.accesslog_user=u.email
    LEFT JOIN chinesepod_production.user_site_links usl ON u.id=usl.user_id
    WHERE log.accesslog_time > '2019-07-09'
    AND log.accesslog_urlbase = 'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue'
    AND usl.usertype_id in (5,6)
    GROUP BY log.accesslog_user;
    `; //Android specific Endpoint used in query

    let logData = await sails.sendNativeQuery(
      sql, [new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]]
    );

    let popularLessons = [];

    logData['rows'].forEach(function (log) {
      try {
        let item = log['accesslog_url'].split('v3_id=')[1].split('&')[0];
        popularLessons.push(item);
      } catch (e) {
        console.log(e);
      }
    });

    let topLessons = {};
    popularLessons.forEach(function (lesson) {
      topLessons[lesson] = (topLessons[lesson] || 0) +1;
    });

    let sortedLessons = Object.keys(topLessons).sort(function (a, b) {
      return topLessons[b]-topLessons[a]
    });

    let topLessonItem = sortedLessons[0];

    if (topLessons[topLessonItem] < 2) {
      topLessonItem = logData['rows'].sort((a, b) => (a.ltv < b.ltv) ? 1 : -1)[0]['accesslog_url'].split('v3_id=')[1].split('&')[0]
    }

    //TODO move to an Async element
    // Respond with view.
    return {
      topLesson: topLessonItem
    };

  }


};
