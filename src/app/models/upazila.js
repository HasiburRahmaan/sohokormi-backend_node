const { Model } = require("objection");

class Upazila extends Model {
  static tableName = "upazilas";
}

module.exports = Upazila;
