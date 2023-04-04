const _ = require("lodash");
const Department = require("../../models/department");
const Designation = require("../../models/designation");

const getAllDepartment = async (req, res) => {
  try {
    let data = await Department.query().select("id", "department");
    return res.send(data);
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send(error);
  }
};
const getAllDesignation = async (req, res) => {
  try {
    let data = await Designation.query().select("id", "designation");
    return res.send(data);
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  getAllDepartment,
  getAllDesignation,
};
