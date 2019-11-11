module.exports = {


  friendlyName: 'View New Dashboard or Redirec',


  description: 'Display "Index" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/index'
    },

    redirect: {
      responseType: 'redirect',
      description: 'Redirecting user based on GEOip'
    },

  },


  fn: async function () {

    let ipData = {};

    const countryList = ['IN', 'PH', 'VN', 'NG', 'ID', 'ET', 'LK', 'BE', 'HK'];

    if (this.req.ip && this.req.ip !== '::1') {
      const ipdata = require('ipdata');
      await new Promise((resolve, reject) => {
        ipdata.lookup(this.req.ip, sails.config.custom.ipDataKey)
          .then((info) => {
            ipData = info;
            resolve(info)
          })
          .catch((err) => {
            sails.log.error(err);
            reject(err)
          });
      })
    }

    sails.log.info({ip:this.req.ip, data: ipData['country_code']});

    if (countryList.includes(ipData['country_code'])) {
      throw {redirect: '/home'}
    } else {
      throw {redirect: 'https://chinesepod.com'}
    }
  }


};
