module.exports = {


  friendlyName: 'Remove access',


  description: '',


  inputs: {
    email: {
      type: 'string',
      required: true
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs) {

    let userData = await User.findOne({email: inputs.email});

    if (!userData) {
      throw 'invalid'
    }

    await UserOptions.updateOrCreate({user_id: userData.id, option_key: 'uploadAccess'}, {user_id: userData.id, option_key: 'uploadAccess', option_value: false})

    return `Removed ${inputs.email} from Uploader List`

  }


};