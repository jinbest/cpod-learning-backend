/**
 * NotFoundLogs.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'logging',
  tableName: 'not_found_logs',

  attributes: {

    id: {
      type: 'number',
      columnType: 'int',
      isInteger: true,
      unique: true,
      autoIncrement: true
    },
    user_id: {
      model: 'User'
    },
    url: {
      type: 'string'
    },
    ip_address: {
      type: 'string'
    },
    user_agent: {
      type: 'string'
    },
    createdAt: {
      type: 'ref',
      columnName: 'created_at',
      autoCreatedAt: true
    },
    updatedAt: false
  },

};

