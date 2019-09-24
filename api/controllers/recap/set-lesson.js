module.exports = {


  friendlyName: 'Set lesson',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function () {

    let lessonId = this.req.path.split('/')[2].toUpperCase();

    if (this.req.me) {
      await Logging.create({
        id: this.req.me.email,
        access_ip: this.req.ip,
        accesslog_url: `https://chinesepod.com/lessons/api?v3_id=${lessonId}&type=lesson`,
        accesslog_sessionid: this.req.session.id,
        accesslog_urlbase: 'https://chinesepod.com/lessons/api',
      }).fetch();

      return `Set current lesson to ${lessonId} for user ${this.req.me.email}`

    } else {

      this.res.redirect('https://www.chinesepod.com/login')
    }



  }
};
