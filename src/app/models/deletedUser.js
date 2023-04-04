const { Model } = require("objection");

class DeletedUser extends Model {
  static tableName = "deletedTeachers";
}

module.exports = DeletedUser;
