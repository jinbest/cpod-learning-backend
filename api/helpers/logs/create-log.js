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

    let ipData = {};

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
      || (inputs.data.userData && inputs.data.userData.email && !['https://www.chinesepod.com/api/v1/lessons/progress'].includes(inputs.data.accesslog_urlbase))) {
      await Logging.create({
        id: inputs.data.id,
        access_ip: inputs.data.access_ip,
        accesslog_url: inputs.data.accesslog_url,
        accesslog_sessionid: inputs.data.accesslog_sessionid,
        accesslog_urlbase: inputs.data.accesslog_urlbase,
        accesslog_country: ipData && ipData['country'] ? ipData['country'] : null,
        referer: inputs.data.referer,
      });
    }


    let date = new Date();

    let index = {
      model: 'accesslog-*',
      elasticModel: 'accesslog-*',
      elasticIndex: `accesslog-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      elasticRecord: [
        'email',
        'access_ip',
        'accesslog_url',
        'accesslog_sessionid',
        'accesslog_urlbase',
        'accesslog_country',
        'referer'
      ],
      idColumn: 'email'
    };

    await new Promise(async (resolve, reject) => {

      let commands = [];
      let action = {
        index: {
          _index: index.elasticIndex,
          _type: index.elasticIndex
        }
      };

      let indexRecord = {};

      inputs.data.email = inputs.data.id; // Ease of Life

      index.elasticRecord.forEach(key => {
        indexRecord[key] = inputs.data[key];
      });
      indexRecord['accesslog_time'] = new Date().toISOString();
      indexRecord['timestamp'] = new Date().toISOString();
      indexRecord['geoip'] = ipData;
      commands.push(action);
      commands.push(indexRecord);

      // run bulk command
      await sails.hooks.elastic.client.bulk({body: commands}, (error, response) => {
        if (error) {
          sails.log.error(error);
          reject(error);
        } else {
          resolve(response)
        }
      });

    });
  }
};
