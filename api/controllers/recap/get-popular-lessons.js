module.exports = {


  friendlyName: 'Get popular lessons for Lesson Recap',


  description: '',



  exits: {

    'noLessons': {
      description: 'Unfortunately there are no lessons'
    }

  },


  fn: async function () {

    let sql = `
    SELECT DISTINCT log.accesslog_user, log.accesslog_url, u.ltv, u.name, u.email
    FROM chinesepod_logging.cp_accesslog log
    LEFT JOIN chinesepod_production.users u ON log.accesslog_user=u.email
    LEFT JOIN chinesepod_production.user_site_links usl ON u.id=usl.user_id
    WHERE log.accesslog_time > $1
    AND log.accesslog_urlbase = 'https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue'
    AND usl.usertype_id in (5,6);
    `; //Android specific Endpoint used in query

    let logData = await sails.sendNativeQuery(
      sql, [new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split('T')[0]] //Adding 12 hour lag
    );

    let popularLessons = [];

    let cleanLog = [];

    logData['rows'].forEach(function (log) {
      try {
        let v3id = log['accesslog_url'].split('v3_id=')[1].split('&')[0];
        cleanLog.push({
          name: log.name,
          email: log.email,
          v3id: v3id,
          ltv: log.ltv
        });
        popularLessons.push(v3id);
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

    if (!topLessonItem) {
      throw 'noLessons'
    }

    let topLesson = await Contents.findOne({
      where: {v3_id:topLessonItem},
      select: ['v3_id', 'title', 'hash_code', 'image']
    });

    let topLessonUsers = cleanLog.filter(student => student['v3id'] === topLessonItem);

    topLessonUsers.sort((b,a) => (a.ltv > b.ltv) ? 1 : ((b.ltv > a.ltv) ? -1 : 0));

    return {
      topLesson: topLesson,
      topLessonUsers: topLessonUsers,
      otherTopLessons: sortedLessons.slice(1),
      lessonViews: topLessons
    }
  }


};
