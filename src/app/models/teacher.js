const { Model } = require("objection");

class Teacher extends Model {
  static tableName = "teachers";

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        userId: { type: "integer" },
      },
    };
  }
}

module.exports = Teacher;
