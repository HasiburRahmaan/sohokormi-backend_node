const DistrictUpazilaRoute = require("../routes/districtUpazilaRoute");
const LogRoute = require("../routes/logRoute");

const { login } = require("../app/controllers/authController");

module.exports = function (app) {
  app.post("/auth/login", login);
  app.use("/", DistrictUpazilaRoute);
  app.use("/log", LogRoute);
};
