/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'Link campaign',


  description: '',


  inputs: {
    campaignId: {
      type: 'string',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    //TODO: ADD SOME VALIDATION
    this.req.session.campaignId = inputs.campaignId.toUpperCase();

    let path = this.req.path.split(`/${inputs.campaignId}`).join('/');

    sails.log.info(this.req.session);

    return this.res.redirect(path)

  }


};
