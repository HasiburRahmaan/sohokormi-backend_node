const { Model } = require("objection");

class Institute extends Model {
  static get tableName() {
    return "institutes";
  }
}

module.exports = Institute;
