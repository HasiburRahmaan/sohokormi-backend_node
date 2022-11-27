const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).send("unauthenticate");
    }

    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    if (!decoded) {
      return res.status(401).send("unauthenticated");
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send("unauthenticate");
  }
};
const SuperAdmin = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send("unauthenticated");
    }
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (!decoded) {
      return res.status(401).send("unauthenticated");
    }

    let user = await User.query().findById(decoded.id);
    if (user?.role != "SuperAdmin") {
      return res.status(401).send("unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send("unauthenticated");
  }
};
const Headmaster = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send("unauthenticated");
    }
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (!decoded) {
      return res.status(401).send("unauthenticated");
    }

    // let user = await User.query().findById(decoded.id);
    if (decoded?.role != "Headmaster") {
      return res.status(401).send("unauthorized");
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send("unauthenticated");
  }
};

module.exports = { auth, SuperAdmin, Headmaster };
