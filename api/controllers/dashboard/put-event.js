module.exports = {


  friendlyName: 'Put event',


  description: '',


  inputs: {
    action: {
      type: 'string',
      required: true
    },
    event_category: {
      type: 'string'
    },
    event_label: {
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    if (sails.config.environment !== 'production' || sails.config.environment === 'staging') {
      return
    }

    if (sails.config.environment === 'development') {
      await sails.helpers.logs.createEvent({
        'userId': inputs.userId,
        'email': this.req.me ? this.req.me.email : '',
        'sessionId': this.req.session.id,
        'access_ip': this.req.ip,
        'action': inputs.action,
        'event_category': inputs.event_category,
        'event_label': inputs.event_label,
        'timestamp': new Date()
      });
    } else {

      userInfoQueue.add('LogEvent', {
        'userId': inputs.userId,
        'email': this.req.me ? this.req.me.email : '',
        'sessionId': this.req.session.id,
        'access_ip': this.req.ip,
        'action': inputs.action,
        'event_category': inputs.event_category,
        'event_label': inputs.event_label,
        'timestamp': new Date()
      },{
        attempts: 3,
        timeout: 60000,
        removeOnComplete: true
      })

    }

  }


};
