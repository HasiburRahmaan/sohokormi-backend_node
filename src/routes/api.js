const adminRoute = require("./api/adminRoute.js");
const frontRoute = require("./api/frontRoute.js");
const headmasterRoute = require("./api/headmasterRoute.js");

module.exports = function (app) {
  adminRoute(app);
  headmasterRoute(app);
  frontRoute(app);

  /* for 404 api */
  app.use("*", (req, res) => {
    return res.status(404).send("api not found");
  });
};
