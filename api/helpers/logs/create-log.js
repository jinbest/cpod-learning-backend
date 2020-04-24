module.exports = {


  friendlyName: 'Create log',


  description: '',


  inputs: {
    data: {
      type: {}
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    let ipData;

    if (inputs.data.access_ip && inputs.data.access_ip !== '::1') {
      const geoip = require('geoip-lite');
      ipData = geoip.lookup(inputs.data.access_ip)
    }

    if ([
      'https://www.chinesepod.com/dash',
      'https://www.chinesepod.com/home',
      'https://www.chinesepod.com/signup',
      'https://www.chinesepod.com/checkout',
      'https://www.chinesepod.com/login'
    ].includes(inputs.data.accesslog_urlbase)
      || (inputs.data.userData && inputs.data.userData.email && !['https://www.chinesepod.com/api/v1/lessons/progress', 'https://www.chinesepod.com/api/v1/dashboard/event'].includes(inputs.data.accesslog_urlbase))) {
      await Logging.create({
        id: inputs.data.id,
        access_ip: inputs.data.access_ip,
        accesslog_url: inputs.data.accesslog_url,
        accesslog_sessionid: inputs.data.accesslog_sessionid,
        accesslog_urlbase: inputs.data.accesslog_urlbase,
        accesslog_country: ipData && ipData['country'] ? ipData['country'] : null,
        accesslog_time: inputs.data.accesslog_time,
        referer: inputs.data.referer,
      });
    }

    let date = new Date();

    let index = {
      model: 'accesslog-*',
      elasticModel: 'accesslog-*',
      elasticIndex: `accesslog-${date.getFullYear()}-${((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' : '') + date.getDate()}`,
      elasticRecord: [
        'email',
        'access_ip',
        'accesslog_url',
        'accesslog_sessionid',
        'accesslog_urlbase',
        'accesslog_country',
        'accesslog_time',
        'timestamp',
        'ua',
        'referer'
      ],
      idColumn: 'email'
    };

    let indexRecord = {};

    inputs.data.email = inputs.data.id;

    index.elasticRecord.forEach(key => {
      indexRecord[key] = inputs.data[key];
    });

    if (ipData) {
      indexRecord['geoip'] = ipData;
    }

    if (inputs.data.ua) {
      var parser = require('ua-parser-js');
      indexRecord['ua'] = parser(inputs.data.ua);
    }

    return await sails.hooks.elastic.client.index({index: index.elasticIndex, body: indexRecord})
      .catch(error => {
        return error
        // sails.hooks.bugsnag.metaData = {index: indexRecord};
        // sails.hooks.bugsnag.notify(error)
      })
  }
};

