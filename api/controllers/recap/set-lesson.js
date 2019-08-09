module.exports = {


  friendlyName: 'Set lesson',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function () {

    let lessonId = this.req.path.split('/')[2].toUpperCase();

    let log =  await Logging.create({
      id: new Date().toISOString().split('T').join(' ').split('.')[0],
      access_ip: this.req.ip,
      accesslog_url: `https://chinesepod.com/lessons/api?v3_id=${lessonId}&type=lesson`,
      accesslog_sessionid: this.req.session.id,
      accesslog_user: this.req.me ? this.req.me.email : 'ugis@chinesepod.com',
      accesslog_urlbase: 'https://chinesepod.com/lessons/api',
    }).fetch();

    return {
      SetCurrentLesson: `Set current lesson to ${lessonId}`,
      log: log
    }
  }
};
