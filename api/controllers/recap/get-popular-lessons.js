module.exports = {


  friendlyName: 'Get popular lessons for Lesson Recap',


  description: '',

  inputs: {
    days: {
      type: 'number',
      description: 'Length of period in days for which to lookup Popular Lessons'
    },
    level: {
      type: 'string'
    }
  },



  exits: {

    'noLessons': {
      description: 'Unfortunately there are no lessons'
    }

  },


  fn: async function (inputs) {
    let period = false; let level = false;
    if (inputs.days) {
      period = inputs.days <= 30 ? inputs.days : 30;
    }

    if (inputs.level) {
      level = inputs.level.toLowerCase()
    }

    let sql = `
    SELECT DISTINCT log.accesslog_user, log.accesslog_url, u.ltv, u.name, u.email
    FROM chinesepod_logging.cp_accesslog log
    LEFT JOIN chinesepod_production.users u ON log.accesslog_user=u.email
    LEFT JOIN chinesepod_production.user_site_links usl ON u.id=usl.user_id
    WHERE log.accesslog_time > $1
    AND log.accesslog_urlbase in ('https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-dialogue', 'https://server4.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail')
    AND usl.usertype_id in (5,6);
    `;

    let logData = await sails.sendNativeQuery(
      sql, [new Date(Date.now() - 60 * 60 * 1000 * (period ? period * 24 : 12) ).toISOString().split('T')[0]] //Adding 12 hour lag
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

    if (level) {
      let filteredLessons = await LessonData.find({id: {in: Object.keys(topLessons)}});

      let removeableLessons = filteredLessons.filter(lesson => lesson.level.split(' ').join('-').toLowerCase() !== level);

      removeableLessons.forEach(lesson => {
        delete topLessons[lesson.id]
      })

    }


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
      select: ['v3_id', 'title', 'hash_code', 'image', 'type']
    });

    let topLessonUsers = cleanLog.filter(student => student['v3id'] === topLessonItem);

    topLessonUsers.sort((b,a) => (a.ltv > b.ltv) ? 1 : ((b.ltv > a.ltv) ? -1 : 0));

    topLesson['imageUrl'] = topLesson.type === 'lesson'
      ? `https://s3contents.chinesepod.com/${topLesson.v3_id}/${topLesson.hash_code}/${topLesson.image}`
      : `https://s3contents.chinesepod.com/extra/${topLesson.v3_id}/${topLesson.hash_code}/${topLesson.image}`;

    return {
      topLesson: topLesson,
      topLessonUsers: topLessonUsers,
      otherTopLessons: sortedLessons.slice(1),
      lessonViews: topLessons,
      days: period
    }
  }


};
