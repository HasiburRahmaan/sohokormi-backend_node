const { Model } = require("objection");

class SchoolTeacherCreateLogs extends Model {
  static get tableName() {
    return "schoolTeacherCreateLogs";
  }
}

module.exports = SchoolTeacherCreateLogs;
