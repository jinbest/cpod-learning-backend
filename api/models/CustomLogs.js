/**
 Generated by sails-inverse-model
 Date:Thu Aug 29 2019 10:33:08 GMT+0800 (Hong Kong Standard Time)
 */

module.exports = {
  tableName: 'custom_logs',
  datastore: 'logging',
  attributes: {
    id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      autoIncrement: true
    },
    text: {
      type: 'string',
      columnType: 'text',
      required: true
    },
    createdAt: {
      type: "string",
      columnType: "timestamp",
      autoCreatedAt: true
    },
    updatedAt: false
  }
};