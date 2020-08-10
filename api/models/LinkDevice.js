/**
 * LinkDevice.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'link_device',
  attributes: {
    id: {
      type: 'number',
      columnType: 'int',
      isInteger: true,
      unique: true,
      autoIncrement: true
    },
    code: {
      type: 'string',
      allowNull: true
    },
    user_id: {
      model: 'User'
    },
    sessionId: {
      type: 'string',
      columnName: 'sessionid',
      allowNull: true
    },
    status: {
      type: 'number',
      isInteger: true,
      defaultsTo: 0
    },
    updatedAt: {
      type: 'ref',
      columnName: 'updated_at',
      autoUpdatedAt: true
    },
    client_id: {
      type: 'string',
      allowNull: true
    }
  },

};

