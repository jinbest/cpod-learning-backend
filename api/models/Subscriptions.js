/**
 Generated by sails-inverse-model
 Date:Fri May 17 2019 18:41:35 GMT+0800 (Hong Kong Standard Time)
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      autoIncrement: true
    },
    user_id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    subscription_id: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      required: true
    },
    subscription_from: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 7 //1=authorize, 2=paypal, 7=stripe
    },
    subscription_type: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 1 // 1: Basic, 2: Premium // 5: Classroom
    },
    is_old: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 0  // undocumented
    },
    product_id: {
      model: 'Products'
    },
    product_length: {
      type: "number",
      columnType: "tinyint",
      isInteger: true  // in months - 1, 3, 12, etc.
    },
    status: {
      type: "number",
      columnType: "tinyint",
      isInteger: true //  1=active, 2=cancelled, 3=past due
    },
    receipt: {
      type: "string",
      columnType: "text",
      allowNull: true // Receipts from IAP purchases - i.e. pikbeokgpdhkmnffaplldaik.AO-J1OxMme-Kb1HKHLiopzvHFjcfZFo-BrRk3DHAULZzZRS-u05Qx3LVN4GKSlQtt4om4Pr4lK2hke1w_xDnGQYrr10WULC8ZykVJQigW-B7Z_CKjFhzkUHOLeUwo-wm94utmD_NSUqgge6saxkbisULU1iM_QBNfQ
    },
    date_cancelled: {
      type: "ref",
      columnType: "datetime",
    },
    createdAt: {
      type: "ref",
      columnType: "datetime",
      columnName: 'date_created',
      autoCreatedAt: true
    },
    next_billing_time: {
      type: "ref",
      columnType: "datetime"
    },
    updatedAt: {
      type: "ref",
      columnType: "timestamp",
      columnName: 'last_modified',
      autoUpdatedAt: true
    },
    cc_num: {
      type: "string",
      columnType: "varchar",
      maxLength: 4,
      required: true
    },
    cc_exp: {
      type: "string",
      columnType: "varchar",
      maxLength: 7,
      required: true
    },
    paypal_email: {
      type: "string",
      columnType: "varchar",
      maxLength: 200,
      defaultsTo: 'STRIPE'
    }
  }
};
