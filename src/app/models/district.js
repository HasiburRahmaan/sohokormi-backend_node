const { Model } = require("objection");

class District extends Model {
  static get tableName() {
    return "districts";
  }
}

module.exports = District;
