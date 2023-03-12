const _ = require("lodash");
const Department = require("../../models/department.js");
const { validator } = require("../../validator/validator.js");

class DepartmentController {
  static getAllDepartment = async (req, res) => {
    try {
      let data = await Department.query().select("id", "department");
      return res.send(data);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
  static createDepartment = async (req, res) => {
    try {
      let obj = _.pick(req.body, ["department"]);

      let validation = await validator(obj, {
        department: { unique: "department, departments" },
      });

      if (!validation.isValid) {
        return res.status(403).send(validation.errorArray);
      }
      let data = await Department.query().insert(obj);

      return res.send(data);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
  static updateDepartment = async (req, res) => {
    try {
      let obj = _.pick(req.body, ["department", "id"]);

      let data = await Department.query().findById(obj.id);

      if (data.department != obj.department) {
        await Department.query().update(obj).where({ id: obj.id });
        data.department = obj.department;
      }
      return res.send(data);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error.toString());
    }
  };
  static deleteDepartment = async (req, res) => {
    try {
      if (req.params.id) {
        await Department.query().delete().where({ id: req.params.id });
      }
      return res.send("deleted");
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
}

module.exports = DepartmentController;
