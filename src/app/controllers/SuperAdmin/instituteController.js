const _ = require("lodash");
const Identifier = require("../../models/identifier");
const Institute = require("../../models/institute");
const Teacher = require("../../models/teacher");
const { validator } = require("../../validator/validator.js");

class InstituteController {
  static createInstitute = async (req, res) => {
    try {
      let obj = _.pick(req.body, [
        "eiin",
        "name",
        "phone",
        "upazilaId",
        "identifier",
      ]);

      let rules = {
        eiin: { required: true, unique: "eiin, institutes" },
        name: { required: true },
        phone: { required: true, type: "phone" },
        upazilaId: { required: true, exists: "id, upazilas" },
        identifier: { required: true, unique: "identifier, institutes" },
      };

      let validation = await validator(obj, rules);

      if (!validation.isValid) {
        return res.status(403).send(validation.errorArray);
      }

      let data = await Institute.query().insert(obj);

      await Identifier.query()
        .update({ isUsed: true })
        .where({ identifier: obj.identifier });

      return res.send(data);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
  static getAllInstitutes = async (req, res) => {
    try {
      let data = await Institute.query();
      return res.send(data);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };

  static getUnusedIdentifiers = async (req, res) => {
    try {
      let data = await Identifier.query()
        .limit(20)
        .where({ isUsed: false })
        .select("identifier");
      return res.status(200).send(data);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
}

module.exports = InstituteController;
