module.exports = {


  friendlyName: 'Email redirect',


  description: '',


  inputs: {
    token: {
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    const links = {
      'wl0b8z96eJo':                      'https://www.youtube.com/watch?v=wl0b8z96eJo',
      '1hhfkIcrYhk':                      'https://www.youtube.com/watch?v=1hhfkIcrYhk',
      'jpc6lEl61LE':                      'https://www.youtube.com/watch?v=jpc6lEl61LE',
      'asdgHu16':                         '/',
      '66characters':                     'https://www.youtube.com/watch?v=jpc6lEl61LE',
      'hsk1prep':                         'https://www.youtube.com/watch?v=jpc6lEl61LE',
      'atwti':                            'https://www.youtube.com/watch?v=jpc6lEl61LE',
      'tonechange':                       'https://www.youtube.com/watch?v=jpc6lEl61LE',
    };

    if (links[inputs.token]) {
      return this.res.redirect(links[inputs.token])
    } else {
      return this.res.redirect('/')
    }



  }


};
