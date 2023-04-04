let expres = require("express");
const TeacherController = require("../../app/controllers/Front/teacherController.js");
const { HeadmasterAuth } = require("../../app/middleware/auth.js");
let route = expres.Router();
module.exports = function (app) {
  app.use("/headmaster", HeadmasterAuth, route);
};

route.post("/create/teacher", TeacherController.createTeacherByHeadmaster);
route.post("/update/teacher", TeacherController.updateUserByHeadmaster);
route.post("/delete/teacher", TeacherController.deleteUsersByHeadmaster);
