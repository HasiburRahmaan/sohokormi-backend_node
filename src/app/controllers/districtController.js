const District = require("../models/district");

const getAllDistricts = async (req, res) => {
  try {
    let data = await District.query();
    return res.send(data);
  } catch (error) {
    console.log("error====>", error);
    return res.status(404).send(error);
  }
};

module.exports = { getAllDistricts };
