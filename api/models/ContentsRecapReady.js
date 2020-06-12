/*
 * Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
 */

module.exports = {
  tableName: 'contents_recap_ready',
  attributes: {
    id: {
      type: "number",
      columnType: "int",
      isInteger: true,
      autoIncrement: true
    },
    lessonId: {
      model: 'LessonData'
    },
    createdAt: {
      type: 'ref',
      autoCreatedAt: true
    },
    updatedAt: {
      type: 'ref',
      autoUpdatedAt: true
    }
  },
}
