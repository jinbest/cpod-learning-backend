module.exports = {

  friendlyName: 'Deliver contact form message',


  description: 'Deliver a contact form message to the appropriate internal channel(s).',


  inputs: {

    emailAddress: {
      required: true,
      type: 'string',
      description: 'A return email address where we can respond.',
      example: 'hermione@hogwarts.edu'
    },

    topic: {
      type: 'string',
      description: 'The topic from the contact form.',
      example: 'I want to buy stuff.'
    },

    fullName: {
      required: true,
      type: 'string',
      description: 'The full name of the human sending this message.',
      example: 'Hermione Granger'
    },

    message: {
      type: 'string',
      description: 'The custom message, in plain text.'
    },

    company:{
      type: 'string',
      description: 'My Company Name'
    },

  },


  exits: {

    success: {
      description: 'The message was sent successfully.'
    }

  },


  fn: async function(inputs) {
    if(inputs.topic){
      topic = inputs.topic
    }else{
      topic = "Academic Page"
    }
    if(inputs.message){
      message = inputs.message
    }else{
      message = "Academic Page"
    }
    if(inputs.company){
      company = inputs.company
    }else{
      company = inputs.schoolName
    }
    if (!sails.config.custom.internalEmailAddress) {
      throw new Error(
        `Cannot deliver incoming message from contact form because there is no internal
email address (\`sails.config.custom.internalEmailAddress\`) configured for this
app.  To enable contact form emails, you'll need to add this missing setting to
your custom config -- usually in \`config/custom.js\`, \`config/staging.js\`,
\`config/production.js\`, or via system environment variables.`
      );
    }

    await sails.helpers.sendTemplateEmail.with({
      // to: sails.config.custom.internalEmailAddress,
      to: 'ugis@chinesepod.com',
      subject: 'New contact form message',
      template: 'internal/email-contact-form',
      layout: false,
      templateData: {
        contactName: inputs.fullName,
        contactEmail: inputs.emailAddress,
        topic: topic,
        message: message,
        company:company
      }
    });

    const zendesk = require('node-zendesk');
    const client = zendesk.createClient({
      username: 'ugis@chinesepod.com',
      token: sails.config.custom.zendeskKey,
      remoteUri: 'https://cpod.zendesk.com/api/v2'
    })
    await new Promise(resolve => {
      client.requests.create({
        request: {
          subject: inputs.topic,
          comment: {
            body: inputs.message
          },
          requester: {
            name: inputs.fullName,
            email: inputs.emailAddress,
            company: inputs.company,
            company: inputs.schoolName,
          }
        }
      }, resolve)
    });
  }
};
