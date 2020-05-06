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
      'wl0b8z96eJo': {external: 'https://www.youtube.com/watch?v=wl0b8z96eJo', internal: 'https://www.chinesepod.com/lesson/i-plan-to-study-abroad'},
      '1hhfkIcrYhk': {external: 'https://www.youtube.com/watch?v=1hhfkIcrYhk', internal: 'https://www.chinesepod.com/lesson/is-learning-chinese-difficult'},
      'jpc6lEl61LE': {external: 'https://www.youtube.com/watch?v=jpc6lEl61LE', internal: 'https://www.chinesepod.com/lesson/chopsticks-are-difficult-to-use'},
      'this-week': {external: 'https://www.youtube.com/watch?v=ma41_WXmwlk', internal: 'https://www.youtube.com/watch?v=ma41_WXmwlk'},
      'this-week-t': {external: 'https://www.youtube.com/watch?v=dIYSsCUhp64', internal: 'https://www.youtube.com/watch?v=dIYSsCUhp64'},
      '66characters': {external: 'https://www.youtube.com/watch?v=Ua3N0Ag9B5U&list=PL2pHdzrcvbMiB936_31BTM3Jlg_0wj7hQ', internal: 'https://www.chinesepod.com/lesson/66-enjoyable-characters-with-joy-1/959'},
      '66characters-t': {external: 'https://www.youtube.com/watch?v=eRiRC5-_IBw&list=PLeYT_HGPLwrua3kn9_uX4OpQAsTDsmx8c', internal: 'https://www.chinesepod.com/lesson/66-enjoyable-characters-with-joy-1/959'},
      'hsk1prep': {external: 'https://www.youtube.com/watch?v=jpc6lEl61LE', internal: 'https://www.chinesepod.com/lesson/introduction-to-hsk-test-prep/958'},
      'hsk1prep-t': {external: 'https://www.youtube.com/watch?v=jpc6lEl61LE', internal: 'https://www.chinesepod.com/lesson/introduction-to-hsk-test-prep/958'},
      'atwti': {external: 'https://www.youtube.com/watch?v=jpc6lEl61LE', internal: 'https://www.chinesepod.com/lesson/intro-to-all-the-way-to-intermediate-series/951'},
      'atwti-t': {external: 'https://www.youtube.com/watch?v=jpc6lEl61LE', internal: 'https://www.chinesepod.com/lesson/intro-to-all-the-way-to-intermediate-series/951'},
      'tonechange': {external: 'https://www.youtube.com/watch?v=O8VytLKQED8&list=PL2pHdzrcvbMigDRj6Kaqv9owAFdvXyujX', internal: 'https://www.chinesepod.com/lesson/tone-change-series-1-%E4%B8%8D-bu/961'},
      'tone-change': {external: 'https://www.youtube.com/watch?v=O8VytLKQED8&list=PL2pHdzrcvbMigDRj6Kaqv9owAFdvXyujX', internal: 'https://www.chinesepod.com/lesson/tone-change-series-1-%E4%B8%8D-bu/961'},
      'tonechange-t': {external: 'https://www.youtube.com/watch?v=UrWKlqfSd0k&list=PLeYT_HGPLwrul_MsE5E8uqyk8KvQQodlo', internal: 'https://www.chinesepod.com/lesson/tone-change-series-1-%E4%B8%8D-bu/961'},
      'tone-change-t': {external: 'https://www.youtube.com/watch?v=UrWKlqfSd0k&list=PLeYT_HGPLwrul_MsE5E8uqyk8KvQQodlo', internal: 'https://www.chinesepod.com/lesson/tone-change-series-1-%E4%B8%8D-bu/961'},
      'charactermindmap': {external: 'https://www.youtube.com/watch?v=cBCgNSoCLSM&list=PL2pHdzrcvbMj6OBCab2yxBo09tTO-wpIE', internal: 'https://www.chinesepod.com/lesson/character-mind-map-%E5%BF%83-heart/963'},
      'character-mind-map': {external: 'https://www.youtube.com/watch?v=cBCgNSoCLSM&list=PL2pHdzrcvbMj6OBCab2yxBo09tTO-wpIE', internal: 'https://www.chinesepod.com/lesson/character-mind-map-%E5%BF%83-heart/963'},
      'charactermindmap-t': {external: 'https://www.youtube.com/watch?v=4txkadULNho&list=PLeYT_HGPLwrtvtVo4xh0M3fOxOWpr7CH9', internal: 'https://www.chinesepod.com/lesson/character-mind-map-%E5%BF%83-heart/963'},
      'character-mind-map-t': {external: 'https://www.youtube.com/watch?v=4txkadULNho&list=PLeYT_HGPLwrtvtVo4xh0M3fOxOWpr7CH9', internal: 'https://www.chinesepod.com/lesson/character-mind-map-%E5%BF%83-heart/963'},
      'shanghai-street-style': {external: 'https://www.youtube.com/watch?v=Nitf3oYBv_c&list=PL2pHdzrcvbMgpwby_lw7N1lGTKrH1BXmw', internal: 'https://www.youtube.com/watch?v=Nitf3oYBv_c&list=PL2pHdzrcvbMgpwby_lw7N1lGTKrH1BXmw'},
      'shanghai-street-style-t': {external: 'https://www.youtube.com/watch?v=borcNqEMh70&list=PLeYT_HGPLwrsM1AnAPGECjfRqGzWMWVmg', internal: 'https://www.youtube.com/watch?v=Nitf3oYBv_c&list=PL2pHdzrcvbMgpwby_lw7N1lGTKrH1BXmw'},
      'chengyu-series': {external: 'https://www.youtube.com/watch?v=ndNYYXRZyiY&list=PL2pHdzrcvbMjIyir_8aXf5pYmKUHSDloA', internal: 'https://www.chinesepod.com/lesson/chengyu-series-say-one-not-two/962'},
      'chengyu-series-t': {external: 'https://www.youtube.com/watch?v=L2wNJBlH694&list=PLeYT_HGPLwrvKq67yoYHW2l5SuORPRVg1', internal: 'https://www.chinesepod.com/lesson/chengyu-series-say-one-not-two/962'},
      'how-to-use-grammar': {external: 'https://www.youtube.com/watch?v=2y78OhpgiqY&list=PL2pHdzrcvbMjlOh5s0VUh0K57FbVNNmbc', internal: 'https://www.chinesepod.com/lesson/me-too-4-ways-to-use-%E4%B9%9F/964'},
      'how-to-use-grammar-t': {external: 'https://www.youtube.com/watch?v=fl-JlWNGemY&list=PLeYT_HGPLwrt_Z5EGkclH6nlNp8KnOt9C', internal: 'https://www.chinesepod.com/lesson/me-too-4-ways-to-use-%E4%B9%9F/964'},
      'tone-change-series-2': {external: 'https://www.youtube.com/watch?v=9j-D3x7LeB8&list=PL2pHdzrcvbMhmCH-LNRm_OXCBxrJg3XUt', internal: 'https://www.chinesepod.com/lesson/continued-tone-change-series-1-studying-for-an-exam/960'},
      'tone-change-series-2-t': {external: 'https://www.youtube.com/watch?v=OEZKQdIaWJA&list=PLeYT_HGPLwrtiDCCxi2RRRu908GH56C-_', internal: 'https://www.chinesepod.com/lesson/continued-tone-change-series-1-studying-for-an-exam/960'},
      'r5onCqBFpmo': {external: 'https://www.youtube.com/watch?v=r5onCqBFpmo', internal: 'https://www.chinesepod.com/lesson/chengyu-series-say-three-speak-four'},
      'r5onCqBFpmo-t': {external: 'https://www.youtube.com/watch?v=jZtB4T3cWds', internal: 'https://www.chinesepod.com/lesson/chengyu-series-say-three-speak-four'},
      'gWdpcfVxCWw': {external: 'https://www.youtube.com/watch?v=gWdpcfVxCWw', internal: 'https://www.chinesepod.com/lesson/continued-tone-change-series-3-being-too-sick-for-work'},
      'gWdpcfVxCWw-t': {external: 'https://www.youtube.com/watch?v=W4Xo6yno6ag', internal: 'https://www.chinesepod.com/lesson/continued-tone-change-series-3-being-too-sick-for-work'},
    };

    if (links[inputs.token]) {
      return this.res.redirect(links[inputs.token][this.req.session.userId ? 'internal' : 'external'])
    } else {
      return this.res.redirect('/')
    }



  }


};
