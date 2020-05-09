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

    if (inputs.optIn) {

      let lists = await MailingLists.find({published: true});

      let promises = [];

      lists.forEach(list => {
        promises.push(MailingListsUsers.create({list_id: list.id, user_id: inputs.userId, method: 'Website Optin'}))
      });

      return Promise.all(promises)

    } else {
      await MailingDoNotContact.updateOrCreate({user_id: inputs.userId}, {
        user_id: inputs.userId,
        reason: 'Website Subscibe - Opt Out'
      });
    }

    return inputs;
    //
    // const newContact = await mauticConnector.contacts.createContact({
    //   email: inputs.email,
    //   firstname: inputs.firstName ? inputs.firstName : '',
    //   lastname: inputs.lastName ? inputs.lastName : '',
    //   fullname: inputs.fullName ? inputs.fullName : '',
    //   userid: inputs.userId ? inputs.userId : '',
    //   promo: inputs.optIn,
    //   academic: inputs.optIn,
    //   activity: inputs.optIn,
    //   shows: inputs.optIn,
    //   newsletter: inputs.optIn,
    //   meetup: inputs.optIn,
    //   country: inputs.ipData['country_name'],
    //   region: inputs.ipData['region'],
    //   city: inputs.ipData['city'],
    // });
    //
    // return newContact

  }


};
