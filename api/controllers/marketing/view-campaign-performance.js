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

    let data;
    if (inputs.code) {

      data  = await sails.sendNativeQuery(`
    select uo.option_value as campaignId, count(uo.option_key) as signups, sum(u.confirm_status) confirmed, count(t.billed_amount) transactions, sum(t.billed_amount) billedAmount
    from user_options uo
        left join users u on uo.user_id = u.id
        left join transactions t on uo.user_id = t.user_id and pay_status = 2
    where uo.option_key = 'campaignId' and uo.option_value like '${inputs.code}%' and uo.last_update between $1 and $2
    group by uo.option_value;`,[inputs.fromDate, inputs.toDate]);

    } else {

      data  = await sails.sendNativeQuery(`
    select uo.option_value as campaignId, count(uo.option_key) as signups, sum(u.confirm_status) confirmed, count(t.billed_amount) transactions, sum(t.billed_amount) billedAmount
    from user_options uo
        left join users u on uo.user_id = u.id
        left join transactions t on uo.user_id = t.user_id and pay_status = 2
    where uo.option_key = 'campaignId' and uo.last_update between $1 and $2
    group by uo.option_value;`,[inputs.fromDate, inputs.toDate]);

    }

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
