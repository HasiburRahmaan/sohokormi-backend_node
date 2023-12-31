const DepartmentController = require("../../app/controllers/SuperAdmin/departmentController.js");
const DesignationController = require("../../app/controllers/SuperAdmin/designationController.js");

let expres = require("express");
const { auth, SuperAdmin } = require("../../app/middleware/auth.js");
const InstituteController = require("../../app/controllers/SuperAdmin/instituteController.js");
const TeacherController = require("../../app/controllers/SuperAdmin/teacherController.js");

let route = expres.Router();

module.exports = function (app) {
  app.use("/admin", auth, SuperAdmin, route);
};

route.get("/department/get/all", DepartmentController.getAllDepartment);
route.post("/department/create", DepartmentController.createDepartment);
route.put("/department/update", DepartmentController.updateDepartment);
route.delete("/department/delete/:id", DepartmentController.deleteDepartment);

route.get("/designation/get/all", DesignationController.getAllDesignation);
route.post("/designation/create", DesignationController.createDesignation);
route.put("/designation/update", DesignationController.updateDesignation);
route.delete(
  "/designation/delete/:id",
  DesignationController.deleteDesignation
);

route.get("/institute/get/all", InstituteController.getAllInstitutes);
route.post("/institute/create", InstituteController.createInstitute);
route.get(
  "/institute/get/unused-identifiers",
  InstituteController.getUnusedIdentifiers
);

/* Teacher's Api */
route.get(
  "/teacher/get/by/identifier",
  TeacherController.getAllTeacherByIdentifier
);
route.post("/teacher/create", TeacherController.createTeacherBySuperAdmin);
route.post(
  "/teacher/create/headmaster",
  TeacherController.createHeadmasterBySuperAdmin
);
route.put("/teacher/update/user", TeacherController.updateUserBySuperAdmin);
route.put(
  "/teacher/update/password",
  TeacherController.changeUsersPasswordBySuperAdmin
);
