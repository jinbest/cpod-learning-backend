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
    await Logging.create({
      id: inputs.data.id,
      access_ip: inputs.data.access_ip,
      accesslog_url: inputs.data.accesslog_url,
      accesslog_sessionid: inputs.data.accesslog_sessionid,
      accesslog_urlbase: inputs.data.accesslog_urlbase,
      accesslog_country: inputs.data.accesslog_country,
      referer: inputs.data.referer,
    });

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

