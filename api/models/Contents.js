/**
 Generated by sails-inverse-model
 Date:Fri May 17 2019 18:41:35 GMT+0800 (Hong Kong Standard Time)
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnType: "int",
      columnName: 'content_id',
      isInteger: true,
      required: true
    },
    createdAt: {
      type: "string",
      columnType: "timestamp",
      columnName: 'created_at',
      autoCreatedAt: true
    },
    updatedAt: {
      type: "string",
      columnType: "timestamp",
      columnName: 'updated_at',
      autoUpdatedAt: true
    },
    status_comments: {
      type: "string",
      columnType: "enum",
      isIn: ["open", "closed", "registered_only"],
      required: true
    },
    status_locked: {
      type: "string",
      columnType: "enum",
      isIn: ["locked", "none"],
      required: true
    },
    status_published: {
      type: "string",
      columnType: "enum",
      isIn: ["publish", "draft", "private"],
      required: true
    },
    created_by: {
      type: "number",
      columnType: "int",
      isInteger: true,
      required: true
    },
    updated_by: {
      type: "number",
      columnType: "int",
      isInteger: true,
      required: true
    },
    popularity: {
      type: "number",
      columnType: "int",
      isInteger: true,
      required: true
    },
    rank: {
      type: "number",
      columnType: "float",
      required: true
    },
    slug: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      unique: true,
      required: true
    },
    type: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      required: true
    },
    series_id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      required: true
    },
    channel_id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      required: true
    },
    maturity: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 1
    },
    title: {
      type: "string",
      columnType: "text",
      required: true
    },
    introduction: {
      type: "string",
      columnType: "text",
      required: true
    },
    theme: {
      type: "string",
      columnType: "varchar",
      maxLength: 100,
      required: true
    },
    channel: {
      type: "string",
      columnType: "varchar",
      maxLength: 100,
      required: true
    },
    level: {
      type: "string",
      columnType: "varchar",
      maxLength: 100,
      required: true
    },
    hosts: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      required: true
    },
    v3_id: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      required: true
    },
    hash_code: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      required: true
    },
    publication_timestamp: {
      type: "string",
      columnType: "timestamp",
      defaultsTo: "0000-00-00 00:00:00"
    },
    time_offset: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 15
    },
    image: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      required: true
    },
    text: {
      type: "string",
      columnType: "blob",
      required: true
    },
    transcription1: {
      type: "string",
      columnType: "text",
      required: true
    },
    transcription2: {
      type: "string",
      columnType: "text",
      required: true
    },
    mp3_dialogue: {
      type: "string",
      columnType: "text",
      required: true
    },
    mp3_media: {
      type: "string",
      columnType: "text",
      required: true
    },
    mp3_mobile: {
      type: "string",
      columnType: "text",
      required: true
    },
    mp3_public: {
      type: "string",
      columnType: "text",
      required: true
    },
    mp3_private: {
      type: "string",
      columnType: "text",
      required: true
    },
    mp3_thefix: {
      type: "string",
      columnType: "text",
      required: true
    },
    pdf1: {
      type: "string",
      columnType: "text",
      required: true
    },
    pdf2: {
      type: "string",
      columnType: "text",
      required: true
    },
    pdf3: {
      type: "string",
      columnType: "text",
      required: true
    },
    pdf4: {
      type: "string",
      columnType: "text",
      required: true
    },
    ppt: {
      type: "string",
      columnType: "varchar",
      maxLength: 255
    },
    ppt_size: {
      type: "number",
      columnType: "int",
      isInteger: true
    },
    video_fix: {
      type: "string",
      columnType: "text",
      required: true
    },
    link_source: {
      type: "string",
      columnType: "text",
      required: true
    },
    link_related: {
      type: "string",
      columnType: "text",
      required: true
    },
    exercises_exercise1: {
      type: "string",
      columnType: "text",
      required: true
    },
    exercises_exercise2: {
      type: "string",
      columnType: "text",
      required: true
    },
    exercises_exercise3: {
      type: "string",
      columnType: "text",
      required: true
    },
    exercises_exercise4: {
      type: "string",
      columnType: "text",
      required: true
    },
    xml_file_name: {
      type: "string",
      columnType: "varchar",
      maxLength: 255,
      required: true
    },
    mp3_dialogue_size: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    mp3_media_size: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    mp3_mobile_size: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    mp3_public_size: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    mp3_private_size: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    mp3_thefix_size: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    mp3_thefix_length: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      defaultsTo: "0:00"
    },
    mp3_public_length: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      defaultsTo: "0:00"
    },
    mp3_private_length: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      defaultsTo: "0:00"
    },
    mp3_mobile_length: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      defaultsTo: "0:00"
    },
    mp3_media_length: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      defaultsTo: "0:00"
    },
    mp3_dialogue_length: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      defaultsTo: "0:00"
    },
    video_flv: {
      type: "string",
      columnType: "text",
      required: true
    },
    video_flv_size: {
      type: "number",
      columnType: "int",
      isInteger: true,
      required: true
    },
    video_flv_length: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      required: true
    },
    video_mp4: {
      type: "string",
      columnType: "text",
      required: true
    },
    video_mp4_size: {
      type: "number",
      columnType: "int",
      isInteger: true,
      required: true
    },
    video_mp4_length: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      required: true
    },
    video_m4v: {
      type: "string",
      columnType: "text",
      required: true
    },
    video_m4v_size: {
      type: "number",
      columnType: "int",
      isInteger: true,
      required: true
    },
    video_m4v_length: {
      type: "string",
      columnType: "varchar",
      maxLength: 20,
      required: true
    },
    last_comment_id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      defaultsTo: 0
    },
    last_comment_time: {
      type: "string",
      columnType: "datetime",
      required: true
    },
    is_private: {
      type: "number",
      columnType: "tinyint",
      isInteger: true,
      defaultsTo: 0
    },
    video: {
      type: "string",
      columnType: "text"
    },
    lesson_plan: {
      type: "string",
      columnType: "text",
      required: true
    },
    lesson_assignment: {
      type: "string",
      columnType: "text",
      required: true
    }
  }
};