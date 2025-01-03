/**
 Generated by sails-inverse-model
 Date:Fri May 17 2019 18:41:35 GMT+0800 (Hong Kong Standard Time)
 */

module.exports = {
  datastore: 'ams_db',
  tableName: 'content_vocabulary',
  attributes: {
    id: {
      type: "number",
      columnType: "bigint",
      columnName: 'content_vocabulary_id',
      isInteger: true,
      autoIncrement: true
    },
    content_id: {
      model: 'AmsContent'
    },
    phonetic: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      allowNull: true
    },
    part_of_speech: {
      type: "string",
      columnType: "text",
      allowNull: true
    },
    target: {
      type: "string",
      columnType: "text",
      allowNull: true
    },
    target_mp3: {
      type: "string",
      columnType: "text",
      allowNull: true
    },
    insentence: {
      type: "string",
      columnType: "text",
      allowNull: true
    },
    source: {
      type: "string",
      columnType: "text",
      allowNull: true
    },
    source_mp3: {
      type: "string",
      columnType: "text",
      allowNull: true
    },
    type: {
      type: "string",
      columnType: "text",
      allowNull: true
    },
    display_order: {
      type: "number",
      columnType: "int",
      allowNull: true
    },
    target_trad: {
      type: "string",
      columnType: "text",
      allowNull: true
    },
    source_trad: {
      type: "string",
      columnType: "text",
      allowNull: true
    },
    updatedAt: false,
    createdAt: false
  }
};
