/*
 * Copyright (c) 2020. Ugis Rozkalns
 */

module.exports = {


  friendlyName: 'Process inactive',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    return await sails.helpers.email.processBounced();

  }


};
