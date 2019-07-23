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
      description: 'IP info sent successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided ip address is invalid.'
    },

  },

  fn: async function (inputs) {
    const ipdata =  require('ipdata');
    var req = this.req;

    const ip = inputs.ipAddress ? inputs.ipAddress : req.ip;

    let ipData = {};

    if(ip) {
      await ipdata.lookup(ip, '67ce141658c735941e1307cf08fcf9a40cd5101a64f19ea674688fff')
        .then((info) => {
          ipData = info;
        })
        .catch((err) => {
          throw 'invalid';
          sails.log.info(err);
        });
    }
    return ipData;
  }
};
