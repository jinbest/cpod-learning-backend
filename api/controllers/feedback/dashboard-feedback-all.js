module.exports = {


  friendlyName: 'Dashboard feedback all',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    let response = ``;

    let filledForms = await FeedbackForms.find({
      where: {
        email: {
          '!': null
        }
      }
    });

    filledForms.forEach((form) => {
      if (form.name || form.email) {
        response += `${form.name ? form.name + ' ': ''}${form.email ? `<${form.email}>`: ''}\n`
      }
    });

    response += ``;

    this.res.set({'Content-Type': 'application/txt'}).send(response)


  }


};
