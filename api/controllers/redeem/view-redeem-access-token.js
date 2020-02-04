/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'View redeem',


  description: 'Display "Redeem" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/redeem/redeem-access-token'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
