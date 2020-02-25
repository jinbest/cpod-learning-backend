module.exports = {


  friendlyName: 'View campaign performance',


  description: 'Display "Campaign performance" page.',

  inputs: {
    fromDate: {
      type: 'string'
    },
    toDate: {
      type: 'string'
    }
  },

  exits: {

    success: {
      viewTemplatePath: 'pages/marketing/campaign-performance'
    }

  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    inputs.fromDate = new Date(inputs.fromDate ? inputs.fromDate : Date.now() - 7 * 24 * 60 * 60 * 1000); // -1 Day
    inputs.toDate = new Date(inputs.toDate ? inputs.toDate : Date.now()); // -1 Day

    sails.log.info(inputs);

    let data  = await sails.sendNativeQuery(`
    select uo.option_value as campaignId, count(uo.option_key) as conversions
    from user_options uo where uo.option_key = 'campaignId' and uo.last_update between $1 and $2
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
