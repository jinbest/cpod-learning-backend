module.exports = {


  friendlyName: 'All courses',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    return await CourseDetail.find({pubstatus: 1, is_private: 0})
      .sort('order_id DESC')

  }


};
