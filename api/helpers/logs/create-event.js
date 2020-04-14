module.exports = {


  friendlyName: 'Create event',


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

    sails.log.info(inputs);

    let ipData;
    const date = new Date();

    if (inputs.data.access_ip && inputs.data.access_ip !== '::1') {
      const geoip = require('geoip-lite');
      ipData = geoip.lookup(inputs.data.access_ip)
    } else {
      inputs.data.access_ip = '';
    }

    let index = {
      model: 'eventlog-*',
      elasticModel: 'eventlog-*',
      elasticIndex: `eventlog-${date.getFullYear()}-${((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' : '') + date.getDate()}`,
      elasticRecord: [
        'userId',
        'email',
        'sessionId',
        'access_ip',
        'action',
        'event_category',
        'event_label',
        'timestamp'
      ],
      idColumn: 'userId'
    };

    let indexRecord = {};

    index.elasticRecord.forEach(key => {
      indexRecord[key] = inputs.data[key];
    });

    if (ipData) {
      indexRecord['geoip'] = ipData;
    }

    sails.log.info(indexRecord);

    return await sails.hooks.elastic.client.index({index: index.elasticIndex, body: indexRecord})
      .catch(error => {
        return error
        // sails.hooks.bugsnag.metaData = {index: indexRecord};
        // sails.hooks.bugsnag.notify(error)
      })

  }


};

