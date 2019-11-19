
module.exports = {
  tableName: 'access_voucher_codes',
  attributes: {
    id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      autoIncrement: true
    },
    code: {
      type: 'string',
      columnType: 'varchar'
    },
    access_type: {
      type: 'string',
      columnType: 'varchar',
      defaultsTo: 'premium'
    },
    code_type: {
      type: 'string',
      columnType: 'varchar',
      defaultsTo: 'days'
    },
    accessLength: {
      description: 'Length of a redeemed voucher in days',
      type: "number",
      columnType: "int",
      columnName: 'length',
      isInteger: true,
      allowNull: true
    },
    created_by: {
      type: 'string',
      columnType: 'varchar'
    },
    expires: {
      type: 'boolean',
      defaultsTo: true
    },
    expiry: {
      type: "string",
      columnType: "datetime",
      allowNull: true
    },
    status: {
      type: 'string',
      columnType: 'varchar',
      defaultsTo: 'created'
    },
    redeemed_by: {
      model: 'User'
    },
    createdAt: {
      type: "string",
      columnType: "datetime",
      columnName: 'created_at',
      autoCreatedAt: true
    },
    updatedAt: {
      type: "string",
      columnType: "datetime",
      columnName: 'updated_at',
      autoUpdatedAt: true
    }
  }
};
