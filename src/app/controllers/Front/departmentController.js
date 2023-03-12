const _ = require("lodash");
const Department = require("../../models/department");

const getAllDepartment = async (req, res) => {
  try {
    let data = await Department.query().select("id", "department");
    return res.send(data);
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  getAllDepartment,
};
