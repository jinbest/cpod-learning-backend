module.exports = {


  friendlyName: 'Process user options',


  description: '',


  inputs: {
    userId: {
      type: 'number',
      isInteger: true,
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    // let userData = await User.findOne({id: inputs.userId});
    //
    // if (!userData) {
    //   return
    // }

    let userOptions = await UserOptions.find({user_id: inputs.userId});

    let data = {};
    userOptions.forEach(entry => {
      data[entry.option_key] = entry.option_value
    });

    // userData = await User.updateOne({id: userData.id})
    //   .set({options: {...userData.options, ...data}});

    return data

  }

};
