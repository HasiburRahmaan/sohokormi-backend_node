const { Model } = require("objection");

class SchoolTeacherCreateLog extends Model {
  static get tableName() {
    return "schoolTeacherCreateLogs";
  }
}

module.exports = SchoolTeacherCreateLog;
