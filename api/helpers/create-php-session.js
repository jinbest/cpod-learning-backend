module.exports = {


  friendlyName: 'Php session maker',


  description: 'Create a RDS DB session for use on the ChinesePod PHP stack',


  inputs: {
    userId: {
      type: 'number',
      description: 'User ID from the Database',
      required: true
    },
    sessionId: {
      type: 'string',
      description: 'Expected session ID'
    }

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

    let userSiteLink = (await UserSiteLinks.find({ user_id: userId, site_id: 2})
      .sort('updatedAt DESC')
      .limit(1))[0];

    if (!userSiteLink) {
      return ''
    }

    let groupId = 7;

    if (userSiteLink) {
      groupId = userSiteLink.usertype_id;
    }

    let groupName = 'free';
    switch (groupId) {
      case 1:
        groupName = 'admin';
        break;
      case 5:
        groupName = 'premium';
        break;
      case 6:
        groupName = 'basic';
        break;
      case 7:
        groupName = 'free';
        break;
    }

    let sessionData = `user|a:8:`
      + `{s:2:"id";s:${userId.toString().length}:"${userId}";`
      + `s:8:"group_id";s:${groupId.toString().length}:"${groupId}";`
      + `s:5:"group";s:${groupName.length}:"${groupName}";`
      + `s:6:"active";s:1:"1";`
      + `s:10:"created_at";s:19:"${sessionStart}";`
      + `s:6:"expiry";s:19:"${sessionEnd}";`
      + `s:7:"site_id";s:1:"2";`
      + `s:17:"user_site_link_id";s:${userSiteLink ? userSiteLink.id.toString().length : 1}:"${userSiteLink ? userSiteLink.id : 0}";}`;
    let session = await PhpSessions.create({
      id: inputs.sessionId ? inputs.sessionId : sails.helpers.strings.random(),
      session_user_id: userId,
      session_start: (currentTime.getTime()/1000).toFixed(0),
      session_time: (expiryTime.getTime()/1000).toFixed(0), //Creation + 1 year
      session_data: sessionData
    })
      .fetch();
    return session.id;
  }
};

