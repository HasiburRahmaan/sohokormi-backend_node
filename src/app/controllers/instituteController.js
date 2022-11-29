const _ = require("lodash");
const { validator } = require("../../validators/validator");
const Identifier = require("../models/identifier");
const Institute = require("../models/institute");
const Teacher = require("../models/teacher");
const { getUpazilaByUpazilaIdFunction } = require("./upazilaController");

const createInstitute = async (req, res) => {
  try {
    // let data = await getUpazilaByUpazilaIdFunction(req.params.upazilaId);

    // if (data) {
    //   return res.send(data);
    // }

    let obj = _.pick(req.body, [
      "eiin",
      "name",
      "phone",
      "upazilaId",
      "identifier",
    ]);

    let rules = {
      eiin: { required: true },
      name: { required: true },
      phone: { required: true, type: "phone" },
      upazilaId: { required: true },
      identifier: { required: true },
    };

    let validationObj = validator(obj, rules);

    if (Object.keys(validationObj).length) {
      return res.status(403).send({ errors: validationObj });
    }

    let institutesWithEiinAndIdentifier = await Institute.query()
      .where("eiin", obj.eiin)
      .orWhere("identifier", obj.identifier);

    if (institutesWithEiinAndIdentifier.length) {
      return res.status(403).send({
        errors: {
          eiin: "Eiin or Identifier already exists",
          identifier: "Eiin or Identifier already exists",
        },
      });
    }

    let upazila = await getUpazilaByUpazilaIdFunction(obj.upazilaId);

    obj.district = upazila.district;
    obj.upazila = upazila.upazila;

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
const getAllInstitutes = async (req, res) => {
  try {
    let data = await Institute.query();
    return res.send(data);
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send(error);
  }
};
const getInstituteByUser = async (req, res) => {
  try {
    if (req?.user?.instituteId) {
      let obj = {};
      let institute = await Institute.query()
        .findById(req.user.instituteId)
        .select([
          "id",
          "eiin",
          "name",
          "phone",
          "district",
          "upazila",
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
const checkIfInstituteContainsUpdatedData = async (req, res) => {
  try {
    if (req?.user?.instituteId) {
      let institute = await Institute.query()
        .findById(req.user.instituteId)
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
const getUnusedIdentifiers = async (req, res) => {
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

module.exports = {
  createInstitute,
  getAllInstitutes,
  getInstituteByUser,
  checkIfInstituteContainsUpdatedData,
  getUnusedIdentifiers,
};
