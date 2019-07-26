module.exports = {


  friendlyName: 'Set char set',


  description: '',


  inputs: {

    userId: {
      type: 'number',
      description: 'User ID from the Database',
    },
    charSet: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided charSet does not match a valid value.'
    },

  },


  fn: async function (inputs) {
    let charInt = 1;
    let charString = 'simplified';

    if (!isNaN(inputs.charSet) && [1,2].includes(parseInt(inputs.charSet))) {
      charInt = inputs.charSet;
      charString = inputs.charSet === 1 ? 'simplified' : 'traditional';
    } else if (isNaN(inputs.charSet) && ['simplified', 'traditional'].includes(inputs.charSet.toLowerCase())) {
      charString = inputs.charSet.toLowerCase();
      charInt = charString === 'simplified' ? 1 : 2;
    } else {
      throw 'invalid'
    }

    //TODO Rewrite as .exec(async func())

    let userSettings = await UserSettings.findOrCreate({user_id:inputs.userId}, {
      user_id: inputs.userId,
      setting: `a:4:{s:5:"ctype";i:${charInt}1;s:3:"pdf";i:0;s:5:"chars";i:0;s:5:"trans";i:1;}`
    });

    let newSetting = userSettings.setting;

    if (newSetting.split('"ctype";i:').length > 1) {
      let oldSetting = newSetting.split('"ctype";i:');
      newSetting = oldSetting[0] + `"ctype";i:${charInt}` + oldSetting[1].slice(1);
    } else {
      let count = parseInt(newSetting.split(':')[1].split(':')[0]);
      let oldSetting = newSetting.split('{').slice(1);
      newSetting = `a:${count + 1}:{s:5:"ctype";i:${charInt};${oldSetting.join()}`;
    }

    let userData = await UserSettings.updateOne({user_id: inputs.userId})
      .set({setting: newSetting});

    sails.log.info(userData);

    return await sails.helpers.users.setOption.with({
      userId: inputs.userId,
      type: 'charSet',
      value: charString
    });
  }


};

