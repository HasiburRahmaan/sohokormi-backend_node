const express = require("express");
const {
  getAllTeacherByInstitute,
  createTeacherBySuperAdmin,
  createTeacherByHeadmaster,
} = require("../app/controllers/teacherController");
const { SuperAdmin, Headmaster } = require("../app/middleware/auth");
const router = express.Router();

router.get("/all/by/institute", getAllTeacherByInstitute);
router.post("/create/by/super-admin", SuperAdmin, createTeacherBySuperAdmin);
router.post("/create/by/headmaster", Headmaster, createTeacherByHeadmaster);

module.exports = router;
