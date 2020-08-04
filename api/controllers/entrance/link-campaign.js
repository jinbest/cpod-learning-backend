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

    if (inputs.campaignId) {
      this.req.session.campaignId = inputs.campaignId.toUpperCase();
    }

    let path = this.req.url.split(`/${inputs.campaignId}`).join('/');

    sails.log.info(this.req.session);

    return this.res.redirect(path)

  }


};
