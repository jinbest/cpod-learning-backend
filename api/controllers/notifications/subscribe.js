module.exports = {


  friendlyName: 'Subscribe',


  description: 'Subscribe notifications.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    // sails.log.info(this.req);

    sails.log.info(this.req.isSocket);

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }
    sails.sockets.join(this.req, 'notifications');
  }


};
