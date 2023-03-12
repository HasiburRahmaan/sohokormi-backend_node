const _ = require("lodash");
const Institute = require("../../models/institute");
const Teacher = require("../../models/teacher");

class InstituteController {
  static getInstituteByUser = async (req, res) => {
    try {
      if (req?.institute?.id) {
        let obj = {};
        let institute = await Institute.query()
          .findById(req.institute.id)
          .join("upazilas", "institutes.upazilaId", "upazilas.id")
          .join("districts", "upazilas.districtId", "districts.id")
          .select([
            "institutes.id",
            "eiin",
            "name",
            "phone",
            "districts.district",
            "upazilas.upazila",
            "version",
          ]);
        let version = req?.query?.version;

        obj.containsNewData = false;

        if (!version || version != institute.version) {
          let teachers = await Teacher.query()
            .where({ instituteId: institute.id })
            .select("userId", "name", "phone", "department");

          institute.teachers = teachers;

          obj.containsNewData = true;
          obj.data = institute;
        }
        return res.send(obj);
      }
      return res.status(404).send("institute not found");
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
  static checkIfInstituteContainsUpdatedData = async (req, res) => {
    try {
      if (req?.institute?.id) {
        let institute = await Institute.query()
          .findById(req.institute.id)
          .select(["version"]);

        let version = req?.query?.version;

        if (!version || version != institute.version) {
          return res.status(200).send(true);
        }
        return res.status(200).send(false);
      }
      return res.status(404).send("institute not found");
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };
}

module.exports = InstituteController;
