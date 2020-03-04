module.exports = {


  friendlyName: 'Set lesson',


  description: '',


  inputs: {
    lessonId: {
      type: 'string',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    let lessonId = inputs.lessonId;

    if (this.req.me) {
      let log = await Logging.create({
        id: this.req.me.email,
        access_ip: this.req.ip,
        accesslog_url: `https://chinesepod.com/lessons/api?v3_id=${lessonId}&type=lesson`,
        accesslog_sessionid: this.req.session.id,
        accesslog_urlbase: 'https://chinesepod.com/lessons/api',
      }).fetch();

      return `Set current lesson to ${lessonId} for user ${this.req.me.email} \n${JSON.stringify(log)}`

    } else {
      return this.res.redirect('/login')
    }



  }
};
