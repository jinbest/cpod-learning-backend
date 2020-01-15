/**
 * LessonProgress.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  datastore: 'logging',
  tableName: 'lesson_tracks',
  attributes: {
    id: {
      type: "string",
      autoIncrement: true
    },
    userId: {
      model: 'User',
      columnName: 'user_id'
    },
    lessonId: {
      model: 'LessonData',
      columnName: 'v3_id'
    },
    track_type: {
      type: 'string',
      columnType: 'varchar'
    },
    progress: {
      type: 'number',
      columnType: 'float'
    },
    createdAt: {
      type: 'ref',
      columnName: 'timestamp',
      autoCreatedAt: true
    },
    updatedAt: {
      type: 'ref',
      columnName: 'updated_at',
      autoUpdatedAt: true
    }

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

