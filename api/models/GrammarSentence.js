/**
 Generated by sails-inverse-model
 Date:Fri May 17 2019 18:41:35 GMT+0800 (Hong Kong Standard Time)
 */

module.exports = {
  tableName: 'grammar_sentence',
  customToJSON: function() {
    return _.pick(this, ['target', 'audio', 'sentence', 'vocabulary', 'en', 'p', 's', 't'])
  },
  attributes: {
    id: {
      type: "number",
      columnType: "int",
      columnName: 'grammar_sentence_id',
      isInteger: true,
      required: true
    },
    grammar_block_id: {
      model: 'GrammarBlock'
    },
    is_correct: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 1
    },
    target: {
      type: "string",
      columnType: "text"
    },
    target_trad: {
      type: "string",
      columnType: "varchar",
      maxLength: 255
    },
    target_annotate: {
      type: "string",
      columnType: "longtext"
    },
    target_audio: {
      type: "string",
      columnType: "varchar",
      maxLength: 255
    },
    source: {
      type: "string",
      columnType: "text"
    },
    source_trad: {
      type: "string",
      columnType: "varchar",
      maxLength: 255
    },
    source_annotate: {
      type: "string",
      columnType: "longtext"
    },
    source_trad_annotate: {
      type: "string",
      columnType: "longtext",
      required: true
    },
    audio: {
      type: "string",
      columnName: 'source_audio',
      columnType: "varchar",
      maxLength: 1000
    },
    tips: {
      type: "string",
      columnType: "varchar",
      maxLength: 255
    },
    display_sort: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      required: true
    },
    createdAt: {
      type: "ref",
      columnName:'create_time',
      columnType: "datetime",
    },
    updatedAt: {
      type: "ref",
      columnName:'update_time',
      columnType: "datetime",
    }
  }
};
