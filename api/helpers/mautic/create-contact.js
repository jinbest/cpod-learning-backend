module.exports = {


  friendlyName: 'Create New Mautic Contact',


  description: '',


  inputs: {

    email: {
      type: 'string',
      isEmail: true
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    fullName: {
      type: 'string'
    },
    userId: {
      type: 'number'
    },
    optIn: {
      type: 'boolean'
    },
    ipData: {
      type: {}
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    //MAUTIC
    const MauticConnector = require('node-mautic');
    const mauticConnector = new MauticConnector({
      apiUrl: 'https://email.chinesepod.com',
      username: 'CpodJsWebsite',
      password: 'zro5YdSykdqYkkgPMBH9yCcGPguGdAbk8IXyjnCW'
    });

    const newContact = await mauticConnector.contacts.createContact({
      email: inputs.email,
      firstname: inputs.firstName ? inputs.firstName : '',
      lastname: inputs.lastName ? inputs.lastName : '',
      fullname: inputs.fullName ? inputs.fullName : '',
      userid: inputs.userId ? inputs.userId : '',
      promo: inputs.optIn,
      academic: inputs.optIn,
      activity: inputs.optIn,
      shows: inputs.optIn,
      newsletter: inputs.optIn,
      meetup: inputs.optIn,
      country: inputs.ipData['country_name'],
      region: inputs.ipData['region'],
      city: inputs.ipData['city'],
    });

    return newContact

  }


};
