module.exports = {


  friendlyName: 'Get details',


  description: '',


  inputs: {
    slug: {
      type: 'string',
      required: true
    }


  },


  exits: {

    invalid: {
      responseType: 'badRequest'
    }

  },


  fn: async function (inputs) {
    let lessonData = await LessonData.findOne({slug: inputs.slug}).select(['title', 'level', 'type', 'hash_code', 'introduction', 'publication_timestamp', 'hosts']);

    if (!lessonData) {
      throw 'invalid'
    }

    const sanitizeHtml = require('sanitize-html');

    const sanitizeOptions = {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'image'],
      allowedAttributes: {
        a: [ 'href', 'name', 'target'],
        image: ['src', 'alt', 'width', 'height'],
      }
    };

    lessonData.introduction = sanitizeHtml(lessonData.introduction, sanitizeOptions);

    const keyMap = {
      column_1: 's',
      column_2: 'p',
      column_3: 'en',
      column_4: 't'
    };

    let vocab = await Vocabulary.find({
      v3_id: lessonData.id,
      vocabulary_class: {
        in: ['Key Vocabulary', 'Supplementary']
      }
    })
      .sort([
        {vocabulary_class: 'ASC'},
        {display_order: 'ASC'}
      ]).limit(4);
    let vocabData = [];
    _.each(vocab, function (item) {
      item['simplified'] = item.column_1;
      item['pinyin'] = item.column_2;
      item['english'] = item.column_3;
      item['traditional'] = item.column_4;
      item['audioUrl'] = `https://s3contents.chinesepod.com/${lessonData.type === 'extra' ? 'extra/' : ''}${lessonData.id}/${lessonData.hash_code}/${item.audio}`
      vocabData.push(_.pick(item, ['simplified', 'traditional', 'pinyin', 'english', 'audioUrl']));
    });

    let rawDialogues = await ContentDialogues.find({v3_id: lessonData.id})
      .sort('display_order ASC').limit(4);

    let dialogueData = [];
    let speakers = [];

    rawDialogues.forEach((dialogue) => {
      if (dialogue.speaker) {
        speakers.push(dialogue.speaker);
      }
      dialogue.vocabulary = [];
      dialogue.sentence = [];
      dialogue.english = dialogue.row_2;
      dialogue.pinyin = '';
      dialogue.simplified = '';
      dialogue.traditional = '';
      dialogue['row_1'].replace(/\(event,\'(.*?)\',\'(.*?)\',\'(.*?)\',\'(.*?)\'.*?\>(.*?)\<\/span\>([^\<]+)?/g, function(A, B, C, D, E, F, G, H) {

        let d = ''; let e = ''; let c = ''; let b = ''; let g = '';

        try {d = decodeURI(D)} catch (err) {
          d = D;
          sails.log.error(err)
        }
        try {e = decodeURI(E)} catch (err) {
          e = E;
          sails.log.error(err)
        }
        try {c = decodeURI(C)} catch (err) {
          c = C;
          sails.log.error(err)
        }
        try {b = decodeURI(B)} catch (err) {
          b = B;
          sails.log.error(err)
        }

        dialogue.pinyin += c + ' ';
        dialogue.simplified += d;
        dialogue.traditional += e;

        if (G) {
          try {g = decodeURI(G)} catch (err) {
            g = G;
            sails.log.error(err)
          }
          dialogue.sentence.push(g);
          dialogue.pinyin += g;
          dialogue.simplified += g;
          dialogue.traditional += g;
        }
      });
      dialogue['audioUrl'] = `https://s3contents.chinesepod.com/${lessonData.type === 'extra' ? 'extra/' : ''}${lessonData.id}/${lessonData.hash_code}/${dialogue.audio}`
      dialogueData.push(_.pick(dialogue, ['audioUrl', 'english', 'pinyin', 'traditional', 'simplified']))
    });

    return {
      lessonTitle: lessonData.title,
      lessonInfo: lessonData,
      vocabulary: vocabData,
      dialogue: dialogueData,
      expansion: []
    }

  }


};
