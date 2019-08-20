module.exports = {


  friendlyName: 'Users by current lesson',


  description: '',


  inputs: {
    lessonId: {
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.lessonId = this.req.url.split('?') ? this.req.url.split('?')[1] : 'REDIRECT';

    if (inputs.lessonId === 'REDIRECT') {
      this.res.redirect('/')
    }

    let sql = `
    SELECT log.accesslog_url, log.accesslog_user, u.name, log.accesslog_time
    FROM chinesepod_logging.cp_accesslog log
    LEFT JOIN chinesepod_production.users u ON log.accesslog_user = u.email
    WHERE log.accesslog_time > $1
    AND log.accesslog_urlbase IN ('https://ws.chinesepod.com:444/1.0.0/instances/prod/lessons/get-lesson-detail', 'https://chinesepod.com/lessons/api')
    AND log.accesslog_user IS NOT NULL
    ORDER BY log.accesslog_time DESC;
    `;


    let latestLoggedLessons = await sails.sendNativeQuery(
      sql, [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]
    );


    let rawData = latestLoggedLessons['rows'];

    let uniqueData = Array.from(new Set(rawData.map(s => s.accesslog_user)))
      .map(accesslog_user => {
        let record = rawData.find(s => s.accesslog_user === accesslog_user);
        return {
          email: accesslog_user,
          name: record.name,
          url: record.accesslog_url,
          time: record.accesslog_time
        }
      });

    let cleanData = uniqueData.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(inputs.lessonId.toLowerCase()) !== -1);

    return cleanData.map(user => {
      return `${user.name ? user.name + ' ' : ''}<${user.email}>`
    })


  }

};
