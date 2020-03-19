module.exports = {


  friendlyName: 'Update profile',


  description: 'Update the profile for the logged-in user.',


  inputs: {

    username: {
      type: 'string',
    },

    name: {
      type: 'string'
    },

    email: {
      type: 'string'
    },

    password: {
      type: 'string'
    },

    changed: {
      type: ['ref']
    }

  },


  exits: {

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
    usernameAlreadyInUse: {
      statusCode: 409,
      description: 'The provided username is already in use.',
    },

  },


  fn: async function (inputs) {

    sails.log.info(inputs);

    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    // Start building the values to set in the db.
    // (We always set the fullName if provided.)
    var valuesToSet = {};

    if (inputs.name){
      valuesToSet.name = inputs.name
    }
    if (inputs.email){

      let conflictingEmail = await User.findOne({
        email: inputs.email
      });

      if (conflictingEmail && conflictingEmail.id !== inputs.userId) {
        throw 'emailAlreadyInUse';
      }

      valuesToSet.email = inputs.email
    }
    if (inputs.username){

      let conflictingUsername = await User.findOne({
        username: inputs.username
      });

      if (conflictingUsername && conflictingUsername.id !== inputs.userId) {
        throw 'usernameAlreadyInUse';
      }

      valuesToSet.username = inputs.username

    }
    if (inputs.password){
      valuesToSet.password = await sails.helpers.passwordHash.with({
        password: inputs.password,
        method: 'E'
      })
    }

    // Save to the db
    let newData = await User.updateOne({id: inputs.userId })
    .set(valuesToSet);

    sails.log.info(newData);
    return newData
  }


};
