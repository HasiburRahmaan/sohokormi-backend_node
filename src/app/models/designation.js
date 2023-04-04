const { Model } = require("objection");

class Designation extends Model {
  static tableName = "designations";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["designation"],
      properties: {
        designation: { type: "string", minLength: 3 },
      },
    };
  }
}

module.exports = Designation;
