module.exports = {
  tableName: 'feedback_forms',
  attributes: {
    id: {
      type: 'number',
      columnType: 'int',
      isInteger: true,
      unique: true,
      autoIncrement: true
    },
    userId: {
      model: 'User',
      columnName: 'user_id',
    },
    name: {
      type: 'string',
      columnType: 'varchar',
      maxLength: 255,
      allowNull: true
    },
    email: {
      type: 'string',
      columnType: 'varchar',
      maxLength: 255,
      allowNull: true
    },
    feedback: {
      type: 'string',
      columnType: 'text',
      columnName: 'feedback_box',
      allowNull: true
    },
    likelyToSwitch: {
      type: 'string',
      columnType: 'varchar',
      columnName: 'likely_to_switch',
      maxLength: 255,
      allowNull: true
    },
    comments: {
      type: 'string',
      columnType: 'text',
      columnName: 'comments_box',
      allowNull: true
    },
    howToStudy: {
      type: 'string',
      columnType: 'varchar',
      columnName: 'how_to_study',
      maxLength: 255,
      allowNull: true
    },
    primaryDevice: {
      type: 'string',
      columnType: 'varchar',
      columnName: 'primary_device',
      maxLength: 255,
      allowNull: true
    },
    other: {
      type: 'string',
      columnType: 'varchar',
      maxLength: 255,
      allowNull: true
    },
    wantsResponse: {
      type: 'number',
      columnType: 'int',
      columnName: 'wants_response',
      isInteger: true,
      defaultsTo: 0
    },
    wantsToParticipate: {
      type: 'number',
      columnType: 'int',
      columnName: 'wants_to_participate',
      isInteger: true,
      defaultsTo: 0
    },
    updatedAt: false,
    createdAt: {
      type: 'string',
      columnType: 'datetime',
      autoCreatedAt: true
    }
  }
};
