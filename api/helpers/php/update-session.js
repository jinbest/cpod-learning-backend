module.exports = {


  friendlyName: 'Php session maker',


  description: 'Create a RDS DB session for use on the ChinesePod PHP stack',


  inputs: {
    userId: {
      type: 'number',
      description: 'User ID from the Database',
      required: true
    },
    planName: {
      type: 'string',
      description: 'Name of the Subscription plan',
    },
    planId: {
      type: 'number',
      description: 'Plan ID from the Database',
    },
  },


  exits: {

    success: {
      description: 'All done. Session created',
    },

  },


  fn: async function (inputs) {
    let userId = inputs.userId;
    let currentTime = new Date();
    let expiryTime = new Date(currentTime.getTime() + 365.25 * 24 * 60 * 60 * 1000); //Creation + 1 year
    let sessionStart = currentTime.toISOString().split('T').join(' ').split('.')[0];
    let sessionEnd = expiryTime.toISOString().split('T').join(' ').split('.')[0];

    let userSiteLink = await UserSiteLinks.findOne({ user_id: userId, site_id: 2});

    let groupId = inputs.planId;

    let groupName = inputs.planName;

    let sessionData = `user|a:8:`
      + `{s:2:"id";s:${userId.toString().length}:"${userId}";`
      + `s:8:"group_id";s:${groupId.toString().length}:"${groupId}";`
      + `s:5:"group";s:${groupName.length}:"${groupName}";`
      + `s:6:"active";s:1:"1";`
      + `s:10:"created_at";s:19:"${sessionStart}";`
      + `s:6:"expiry";s:19:"${sessionEnd}";`
      + `s:7:"site_id";s:1:"2";`
      + `s:17:"user_site_link_id";s:${userSiteLink.id.toString().length}:"${userSiteLink.id}";}`;
    let session = await PhpSessions.create({
      id: sails.helpers.strings.random(),
      session_user_id: userId,
      session_start: (currentTime.getTime()/1000).toFixed(0),
      session_time: (expiryTime.getTime()/1000).toFixed(0), //Creation + 1 year
      session_data: sessionData
    })
      .fetch();
    return session.id;
  }
};

