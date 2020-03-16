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

    userInfoQueue.add('LogEvent', {
      'userId': inputs.userId,
      'email': this.req.me ? this.req.me.email : '',
      'sessionId': this.req.session.id,
      'access_ip': this.req.ip,
      'action': inputs.action,
      'event_category': inputs.event_category,
      'event_label': inputs.event_label,
      'timestamp': new Date()
      })

  }


};
