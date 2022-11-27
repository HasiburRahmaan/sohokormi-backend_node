const express = require("express");
const {
  createInstitute,
  getAllInstitutes,
  getInstituteByUser,
  checkIfInstituteContainsUpdatedData,
  getUnusedIdentifiers,
} = require("../app/controllers/instituteController");
const router = express.Router();

router.post("/create", createInstitute);
router.get("/all", getAllInstitutes);
router.get("/get/by/user", getInstituteByUser);
router.get(
  "/get/if-institute-contains-new-data",
  checkIfInstituteContainsUpdatedData
);
router.get("/get/unused-identifiers", getUnusedIdentifiers);

module.exports = router;
