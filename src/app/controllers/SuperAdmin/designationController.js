const _ = require("lodash");
const Designation = require("../../models/designation.js");
const { validator } = require("../../validator/validator.js");

class DesignationController {
  static getAllDesignation = async (req, res) => {
    try {
      let data = await Designation.query().select("id", "designation");
      return res.send(data);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
  static createDesignation = async (req, res) => {
    try {
      let obj = _.pick(req.body, ["designation"]);

      let validation = await validator(obj, {
        designation: { unique: "designation, designations" },
      });

      if (!validation.isValid) {
        return res.status(403).send(validation.errorArray);
      }
      let data = await Designation.query().insert(obj);

      return res.send(data);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
  static updateDesignation = async (req, res) => {
    try {
      let obj = _.pick(req.body, ["designation", "id"]);

      let data = await Designation.query().findById(obj.id);

      if (data.designation != obj.designation) {
        await Designation.query().update(obj).where({ id: obj.id });
        data.designation = obj.designation;
      }
      return res.send(data);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error.toString());
    }
  };
  static deleteDesignation = async (req, res) => {
    try {
      if (req.params.id) {
        await Designation.query().delete().where({ id: req.params.id });
      }
      return res.send("deleted");
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
}

module.exports = DesignationController;
