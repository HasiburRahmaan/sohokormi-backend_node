const { Model } = require("objection");

class Identifier extends Model {
  static get tableName() {
    return "identifiers";
  }
}

module.exports = Identifier;
