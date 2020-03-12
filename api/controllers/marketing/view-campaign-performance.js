module.exports = {


  friendlyName: 'View campaign performance',


  description: 'Display "Campaign performance" page.',

  inputs: {
    fromDate: {
      type: 'string'
    },
    toDate: {
      type: 'string'
    },
    code: {
      type: 'string',
      required: true,
      minLength: 2
    }
  },

  exits: {

    success: {
      viewTemplatePath: 'pages/marketing/campaign-performance'
    }

  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    inputs.fromDate = inputs.fromDate ? new Date(inputs.fromDate) : new Date(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0,0,0,0)); // -7 Days
    inputs.toDate = inputs.toDate ? new Date(inputs.toDate) : new Date(new Date().setHours(23,59,59,999));

    sails.log.info(inputs);

    let data  = await sails.sendNativeQuery(`
    select uo.option_value as campaignId, count(uo.option_key) as conversions
    from user_options uo where uo.option_key = 'campaignId' and uo.option_value like '${inputs.code}%' and uo.last_update between $1 and $2
    group by uo.option_value;`,[inputs.fromDate, inputs.toDate]);

    sails.log.info(data);

    return {
      campaigns: data['rows'],
      formData: {
        fromDate: inputs.fromDate.toISOString(),
        toDate: inputs.toDate.toISOString()
      }
    }

  }


};
