module.exports = {


  friendlyName: 'Get questions',


  description: '',


  inputs: {
    lessonId: {
      type: 'string',
      required: true
    },
    userId: {
      type: 'number'
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    inputs.userId = sails.config.environment === 'development' ? 1016995 : this.req.session.userId;

    const convert = require('xml-js');

    // All done.
    let lessonQuestions = await Questions.find({scope: inputs.lessonId, product_id: 1, status: 1});


    lessonQuestions.forEach((question) => {
      question.options = convert.xml2js(question.options, {compact: true, ignoreAttributes: true});
      question.options_2 = convert.xml2js(question.options_2, {compact: true, ignoreAttributes: true});
      question.options_3 = convert.xml2js(question.options_3, {compact: true, ignoreAttributes: true});
      switch (question.type_id) {
        case 4:
          question.question = {
            audio: question.options.type_d.data.prototype_mp3_url['_text'],
          };
          question.answer = {
            s: question.options.type_d.data.prototype['_text'],
            t: question.options_2.type_d.data.prototype['_text'],
            p: question.options_3.type_d.data.prototype['_text'],
            e: question.options.type_d.data.english['_text'],
          };
          break;
        case 2:
          question.question = {segments: []};
          question.options.type_b.data.section.forEach((segment, index) => {
            // question.question.segments[index] = {...question.question.segments[index],...{}}
            question.question.segments.push({
              s: segment.prototype['_text'],
              t: question.options_2.type_b.data.section[index].prototype['_text'],
              p: question.options_3.type_b.data.section[index].prototype['_text'],
              e: segment.english['_text'],
              id: parseInt(segment.tag['_text']),
            })
          });
          break;
        case 1:
          question.question = {segments: []};
          question.options.type_a_options.data.section.forEach((phrase, index) => {
            question.question.segments.push({
              id: parseInt(phrase.tag['_text']),
              s: phrase.prototype['_text'],
              t: question.options_2.type_a_options.data.section[index].prototype['_text'],
              p: question.options_3.type_a_options.data.section[index].prototype['_text'],
              e: phrase.english['_text'],
            })
          });
          break;
        case 5:
          question.question = {
            s: question.title,
            t: question.title_2,
            p: question.title_3,
            choices: [],
          };
          question.answer = {
            id: parseInt(question.options.type_e.data.answer['_text']),
            s: question.options.type_e.data.sentence_translation['_text'],
            t: question.options_2.type_e.data.sentence_translation['_text'],
            p: question.options_3.type_e.data.sentence_translation['_text'],
            e: question.options.type_e.data.sentence_english['_text']
          };
          question.options.type_e.data.options.forEach((choice, index) => {
            question.question.choices.push({
              id: parseInt(choice.tag['_text']),
              s: choice.prototype['_text'],
              t: question.options_2.type_e.data.options[index].prototype['_text'],
              p: question.options_3.type_e.data.options[index].prototype['_text'],
              e: choice.english['_text'],
            })
          });
          break;
      }
    });
    lessonQuestions = lessonQuestions.map((question) => {return _.pick(question, ['id', 'scope', 'score', 'type_id', 'status', 'question', 'answer', 'createdAt'])});

    return {
      matching: lessonQuestions.filter((question) => {return question.type_id === 1}),
      audio: lessonQuestions.filter((question) => {return question.type_id === 4}),
      choice: lessonQuestions.filter((question) => {return question.type_id === 5}),
      rearrange: lessonQuestions.filter((question) => {return question.type_id === 2}),
    }

  }


};
