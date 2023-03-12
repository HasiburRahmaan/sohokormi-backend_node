let expres = require("express");
const {
  getAllDepartment,
} = require("../../app/controllers/Front/departmentController.js");

const InstituteController = require("../../app/controllers/Front/instituteController.js");
const TeacherController = require("../../app/controllers/Front/teacherController.js");

const { TeacherAuth } = require("../../app/middleware/auth.js");

let route = expres.Router();

module.exports = function (app) {
  app.use("/app", TeacherAuth, route);
};

route.get("/department/get/all", getAllDepartment);

route.get("/institute/get/by/user", InstituteController.getInstituteByUser);
route.get(
  "/institute/get/if-institute-contains-new-data",
  InstituteController.checkIfInstituteContainsUpdatedData
);

route.get(
  "/teacher/get/by/identifier",
  TeacherController.getAllTeacherByIdentifier
);
