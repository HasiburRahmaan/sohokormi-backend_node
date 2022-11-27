const { Model } = require("objection");

class Department extends Model {
  static tableName = "departments";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["department"],
      properties: {
        department: { type: "string", minLength: 3 },
      },
    };
  }
}

module.exports = Department;
