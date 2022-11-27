const express = require("express");
const { getAllDistricts } = require("../app/controllers/districtController");
const {
  getAllUpazilla,
  getUpazillaByDistrictId,
  getUpazillaByUpazilaId,
} = require("../app/controllers/upazilaController");
const router = express.Router();

router.get("/districts", getAllDistricts);
router.get("/upazilas", getAllUpazilla);
router.get("/upazila/id/:upazilaId", getUpazillaByUpazilaId);
router.get("/upazila/:districtId", getUpazillaByDistrictId);

module.exports = router;
