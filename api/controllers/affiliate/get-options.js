module.exports = {


  friendlyName: 'Get options',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    function toObject(arr) {
      var rv = {};
      arr.forEach(option => {
        rv[option.option_key] = option.option_value
      });
      return rv;
    }

    let affiliateOptions = toObject(
      await UserOptions.find({
        user_id: inputs.userId,
        option_key: {
          startsWith: 'affiliate'
        }
      })
    );

    return affiliateOptions.affiliate
      ? affiliateOptions
      : {affiliate: 0}

  }


};
