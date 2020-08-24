
module.exports = {
  tableName: 'access_academic_codes',
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
    created_by: {
      type: 'string',
      columnType: 'varchar'
    },
    expiry: {
      type: "ref",
      columnType: "datetime"
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
