module.exports = {


  friendlyName: 'Site association',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    // All done.
    return {
      "applinks": {
        "apps": [],
        "details": [
          {
            "appID": "4R8B43XWAY.com.chinesepod.ios",
            "paths": [ "*" ]
          }
        ]
      }
    }

  }


};
