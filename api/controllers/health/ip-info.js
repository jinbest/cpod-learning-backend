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
    const IPData =  require('ipdata').default;
    const ipdata = new IPData(sails.config.custom.ipDataKey);
    var req = this.req;

    const ip = inputs.ipAddress ? inputs.ipAddress : req.ip;

    let ipData = {};

    if(ip && ip !== '::1') {
      try {
        await ipdata.lookup(ip)
          .then((info) => {
            ipData = info;
          })
          .catch((err) => {
            throw 'invalid';
            sails.log.error(err);
          });
      } catch (e) {
        sails.log.error(e)
      }

    }
    return ipData;
  }
};
