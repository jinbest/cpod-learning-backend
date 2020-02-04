/**
 * Vouchers.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  datastore: 'chinesepod2015',
  tableName: 'Vouchers',
  attributes: {
    id: {
      columnName: 'voucher_id',
      type: 'number',
      autoIncrement: true,
      required: true
    },
    product_id: {
      type: 'number',
      isInteger: true,
      isIn: [2, 18, 140, 13, 14, 142],
      required: true
    },
    voucher_code: {
      type: 'string',
      required: true
    },
    expiry_date: {
      type: 'ref',
      columnType: 'date',
      required: true
    },
    code_status: {
      type: 'number',
      isInteger: true,
      isIn: [0,1],
      defaultsTo: 1
    },
    org_id: {
      type: 'number',
      isInteger: true,
      defaultsTo: 1
    },
    redeemed_by: {
      type: 'number',
      isInteger: true,
      defaultsTo: 0
    },
    createdAt: {
      type: 'ref',
      columnName: 'date_created',
      autoCreatedAt: true
    },
    updatedAt: {
      type: 'ref',
      columnName: 'last_modified',
      autoUpdatedAt: true
    },
    created_by: {
      type: 'number',
      required: true
    },
    modified_by: {
      type: 'number',
      required: true
    },
    assigned_to: {
      type: 'number',
      allowNull: true
    }

  },

};

