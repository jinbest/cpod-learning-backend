module.exports = {


  friendlyName: 'IP Information',


  description: 'Take request or provided IP address - send available IP Data',


  inputs: {

    ipAddress: {
      type: 'string',
      description: 'IP Address for IPDATA Lookup',
    }
  },


  exits: {

    success: {
      description: 'New user account was created successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
        'parameters should have been validated/coerced _before_ they were sent.'
    },

  },

  fn: async function (inputs) {
    const ipdata =  require('ipdata');
    var req = this.req;

    if (inputs.ipAddress != '') {
      const ip = inputs.ipAddress;
    } else {
      const ip = req.ip;
    }

    let ipData = {};

    if(ip) {
      await ipdata.lookup(req.ip, '67ce141658c735941e1307cf08fcf9a40cd5101a64f19ea674688fff')
        .then(function (info) {
          ipData = info;
        })
        .catch(function (err) {
          throw 'invalid';
        });
    }


    return ipData;
  }
};
