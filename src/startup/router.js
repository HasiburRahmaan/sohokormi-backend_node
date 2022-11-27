const TeacherRoute = require("../routes/teacherRoute");
const DistrictUpazilaRoute = require("../routes/districtUpazilaRoute");
const DepartmentRoute = require("../routes/departmentRoute");
const InstituteRoute = require("../routes/instituteRoute");
const LogRoute = require("../routes/logRoute");
const UserRoute = require("../routes/userRoute");

const { login } = require("../app/controllers/authController");

const { auth } = require("../app/middleware/auth");

module.exports = function (app) {
  app.post("/auth/login", login);

  app.use("/department", DepartmentRoute);
  app.use("/", DistrictUpazilaRoute);
  app.use("/institute", auth, InstituteRoute);
  app.use("/log", LogRoute);
  app.use("/teacher", auth, TeacherRoute);
  app.use("/user", UserRoute);
};
