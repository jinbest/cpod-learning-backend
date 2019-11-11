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


  fn: async function (req, res) {

    let ipData = {};

    const countryList = ['IN', 'PH', 'VN', 'NG', 'ID', 'ET', 'LK', 'BE', 'HK'];

    if (req.ip && req.ip !== '::1') {
      const ipdata = require('ipdata');
      ipData = await ipdata.lookup(req.ip, sails.config.custom.ipDataKey)
        .then((info) => {
          return info
        })
        .catch((err) => {
          sails.log.error(err);
        });
    }

    if (countryList.includes(ipData['country_code'])) {
      sails.log.info(ipData['country_code']);
      throw {redirect: '/home'}
    } else {
      sails.log.info(ipData['country_code']);
      throw {redirect: 'https://chinesepod.com'}
    }
  }


};
