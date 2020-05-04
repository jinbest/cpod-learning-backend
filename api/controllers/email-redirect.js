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
      'this-week':                        'https://www.youtube.com/watch?v=ma41_WXmwlk',
      'this-week-t':                      'https://www.youtube.com/watch?v=dIYSsCUhp64',
      '66characters':                     'https://www.youtube.com/watch?v=Ua3N0Ag9B5U&list=PL2pHdzrcvbMiY5KSKPYLAprBWYBOJRxIw',
      '66characters-t':                   'https://www.youtube.com/watch?v=eRiRC5-_IBw&list=PLeYT_HGPLwrua3kn9_uX4OpQAsTDsmx8c',
      'hsk1prep':                         'https://www.youtube.com/watch?v=jpc6lEl61LE',
      'hsk1prep-t':                       'https://www.youtube.com/watch?v=jpc6lEl61LE',
      'atwti':                            'https://www.youtube.com/watch?v=jpc6lEl61LE',
      'atwti-t':                          'https://www.youtube.com/watch?v=jpc6lEl61LE',
      'tonechange':                       'https://www.youtube.com/watch?v=O8VytLKQED8&list=PL2pHdzrcvbMigDRj6Kaqv9owAFdvXyujX',
      'tone-change':                      'https://www.youtube.com/watch?v=O8VytLKQED8&list=PL2pHdzrcvbMigDRj6Kaqv9owAFdvXyujX',
      'tonechange-t':                     'https://www.youtube.com/watch?v=UrWKlqfSd0k&list=PLeYT_HGPLwrul_MsE5E8uqyk8KvQQodlo',
      'tone-change-t':                    'https://www.youtube.com/watch?v=UrWKlqfSd0k&list=PLeYT_HGPLwrul_MsE5E8uqyk8KvQQodlo',
      'charactermindmap':                 'https://www.youtube.com/watch?v=cBCgNSoCLSM&list=PL2pHdzrcvbMj6OBCab2yxBo09tTO-wpIE',
      'character-mind-map':               'https://www.youtube.com/watch?v=cBCgNSoCLSM&list=PL2pHdzrcvbMj6OBCab2yxBo09tTO-wpIE',
      'charactermindmap-t':               'https://www.youtube.com/watch?v=4txkadULNho&list=PLeYT_HGPLwrtvtVo4xh0M3fOxOWpr7CH9',
      'character-mind-map-t':             'https://www.youtube.com/watch?v=4txkadULNho&list=PLeYT_HGPLwrtvtVo4xh0M3fOxOWpr7CH9',
      'shanghai-street-style':            'https://www.youtube.com/watch?v=Nitf3oYBv_c&list=PL2pHdzrcvbMgpwby_lw7N1lGTKrH1BXmw',
      'shanghai-street-style-t':          'https://www.youtube.com/watch?v=borcNqEMh70&list=PLeYT_HGPLwrsM1AnAPGECjfRqGzWMWVmg',
    };

    if (links[inputs.token]) {
      return this.res.redirect(links[inputs.token])
    } else {
      return this.res.redirect('/')
    }



  }


};
