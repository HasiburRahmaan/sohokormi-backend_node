const express = require("express");
const {
  getAllDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../app/controllers/departmentController");
const router = express.Router();

router.post("/create", createDepartment);
router.get("/all", getAllDepartment);
router.post("/update", updateDepartment);
router.delete("/delete/:id", deleteDepartment);

module.exports = router;
