/**
 Generated by sails-inverse-model
 Date:Fri May 17 2019 18:41:35 GMT+0800 (Hong Kong Standard Time)
 */

module.exports = {
  tableName: 'grammar_detail',
  customToJSON: function() {
    return _.pick(this, ['id', 'name', 'introduction', 'tree', 'createdAt'])
  },
  attributes: {
    id: {
      type: "number",
      columnType: "int",
      columnName: 'grammar_id',
      isInteger: true,
      required: true
    },
    name: {
      type: "string",
      columnType: "varchar",
      maxLength: 300
    },
    introduction: {
      type: "string",
      columnType: "text",
      required: true
    },
    related_grammar: {
      type: "string",
      columnType: "text",
      required: true
    },
    summary: {
      type: "string",
      columnType: "text",
      required: true
    },
    level_id: {
      type: "number",
      columnType: "int",
      isInteger: true
    },
    image: {
      type: "string",
      columnType: "varchar",
      maxLength: 255
    },
    parent_id: {
      type: "number",
      columnType: "int",
      isInteger: true
    },
    tree: {
      type: "string",
      columnType: "varchar",
      maxLength: 1000,
      required: true
    },
    display_type: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      required: true
    },
    display_layer: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      required: true
    },
    display_sort: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 1
    },
    production_id: {
      type: "number",
      columnType: "int",
      isInteger: true
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