module.exports = {


  friendlyName: 'Opt out of new dashboard',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    this.res.cookie('new_dashboard', false, {
      domain: '.chinesepod.com',
      expires: new Date(Date.now())
    });
    this.res.clearCookie('new_dashboard', {path:'/'});

    this.res.redirect('https://chinesepod.com/dashboard')
  }


};
