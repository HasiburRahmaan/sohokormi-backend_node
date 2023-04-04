const jwt = require("jsonwebtoken");
const Institute = require("../models/institute");
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
    if (user?.roleId != 1) {
      return res.status(401).send("unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send("unauthenticated");
  }
};

const HeadmasterAuth = async (req, res, next) => {
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
    if (user?.roleId != 2) {
      return res.status(401).send("unauthorized");
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send("unauthenticated");
  }
};
const TeacherAuth = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    const identifier = req?.headers?.identifier;

    if (!identifier) {
      return res.status(401).send("identifier not provided");
    }
    let institute = await Institute.query().findOne({ identifier: identifier });

    if (!institute) {
      return res.status(401).send("invalid identifier");
    }
    // if (!token) {
    //   return res.status(401).send("unauthenticated");
    // }
    // const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    // if (!decoded) {
    //   return res.status(401).send("unauthenticated");
    // }

    // let user = await User.query().findById(decoded.id);
    // if (user?.role != "Headmaster") {
    //   return res.status(401).send("unauthorized");
    // }

    req.institute = institute;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send("unauthenticated");
  }
};

module.exports = { auth, SuperAdmin, HeadmasterAuth, TeacherAuth };
