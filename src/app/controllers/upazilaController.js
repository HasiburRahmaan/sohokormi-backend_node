const Upazila = require("../models/upazila");

const getUpazilaByUpazilaIdFunction = async (upazilaId) => {
  let data = await Upazila.query()
    .join("districts", "upazilas.districtId", "=", "districts.id")
    .where({ "upazilas.id": upazilaId })
    .select(
      "upazilas.id",
      "upazilas.upazila",
      "districts.id as districtId",
      "districts.district"
    );

  if (data?.length) {
    data = data[0];
    return data;
  }
  return false;
};

const getAllUpazilla = async (req, res) => {
  try {
    let data = await Upazila.query();
    return res.send(data);
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send(error);
  }
};
const getUpazillaByUpazilaId = async (req, res) => {
  try {
    // let data = await Upazila.query().findById(req.params.upazilaId);
    let data = await getUpazilaByUpazilaIdFunction(req.params.upazilaId);

    if (data) {
      return res.send(data);
    }

    return res.status(404).send("not found");
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send(error);
  }
};
const getUpazillaByDistrictId = async (req, res) => {
  try {
    if (req.params.districtId) {
      let data = await Upazila.query().where(
        "districtId",
        "=",
        req.params.districtId
      );
      return res.send(data);
    }
    return res.status(403).send("district id required");
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  getAllUpazilla,
  getUpazillaByUpazilaId,
  getUpazillaByDistrictId,
  getUpazilaByUpazilaIdFunction,
};
