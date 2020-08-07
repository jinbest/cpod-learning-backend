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
    phone: {
      type: 'string',
      description: 'The phone number, in plain text.'
    },
    company: {
      type: 'string',
      description: 'Interested company'
    },
    schoolName: {
      type: 'string',
      description: 'Interested school'
    }

  },


  exits: {

    success: {
      description: 'The message was sent successfully.'
    },

    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function(inputs) {

    if(!inputs.message && !inputs.schoolName) {
      throw 'invalid'
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
        topic: `${inputs.company || inputs.schoolName ? `[INQUIRY] ${inputs.company ? `${inputs.company} - ` : `${inputs.schoolName} - `}`: ''}${inputs.topic ? `${inputs.topic}` : ''}`,
        message: inputs.message ? inputs.phone ? `Phone Number: ${inputs.phone} | Message: ${inputs.message}` : inputs.message : 'Inquiry'
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
          subject: `${inputs.company || inputs.schoolName ? `[INQUIRY] ${inputs.company ? `${inputs.company} - ` : `${inputs.schoolName} - `}`: ''}${inputs.topic ? `${inputs.topic}` : ''}`,
          comment: {
            body: inputs.message ? inputs.phone ? `Phone Number: ${inputs.phone} | Message: ${inputs.message}` : inputs.message : 'Inquiry'
          },
          requester: {
            name: inputs.fullName,
            email: inputs.emailAddress
          }
        }
      }, resolve)
    });

  }


};
