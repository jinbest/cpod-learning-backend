
/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/recap/upload'
    }

  },


  fn: async function () {

    var url = require('url');

    // Get the list of things this user can see.
    var things = []

    // Respond with view.
    return {
      currentSection: 'things',
      things: things,
    };

  }


};
