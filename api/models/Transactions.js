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
    transaction_id: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      allowNull: true
    },
    subscription_id: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      allowNull: true
    },
    user_id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    product_id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    product_length: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 0
    },
    is_old: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 0
    },
    product_price: {
      type: "number",
      columnType: "decimal",
      defaultsTo: 0.00
    },
    currency: {
      type: "string",
      columnType: "char",
      maxLength: 3,
      defaultsTo: "USD"
    },
    is_recurring_payment: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 0
    },
    is_recurring_product: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 1
    },
    discount: {
      type: "number",
      columnType: "decimal",
      defaultsTo: 0.00
    },
    balance_before: {
      type: "number",
      columnType: "decimal",
      defaultsTo: 0.00
    },
    balance_after: {
      type: "number",
      columnType: "decimal",
      defaultsTo: 0.00
    },
    billed_amount: {
      type: "number",
      columnType: "decimal",
      defaultsTo: 0.00
    },
    promotion_code: {
      type: "string",
      columnType: "char",
      maxLength: 15,
      allowNull: true
    },
    voucher_code: {
      type: "string",
      columnType: "char",
      maxLength: 10,
      allowNull: true
    },
    pay_status: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 1
    },
    pay_method: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 1
    },
    notes: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      allowNull: true
    },
    country: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      allowNull: true
    },
    region: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      allowNull: true
    },
    city: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      allowNull: true
    },
    ip_address: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      allowNull: true
    },
    createdAt: {
      type: "ref",
      columnName: 'date_created',
      columnType: "datetime",
      autoCreatedAt: true
    },
    created_by: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 888
    },
    modified_by: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 888
    },
    updatedAt: {
      type: "ref",
      columnType: "timestamp",
      columnName: 'last_modified',
      autoUpdatedAt: true,
    },
    email: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 0
    },
  }
};