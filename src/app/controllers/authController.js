const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Teacher = require("../models/teacher");
const User = require("../models/user");
require("dotenv").config();

const generateAuthToken = (user) => {
  let secret = process.env.JWT_PRIVATE_KEY || "jwt_private_key_teachershportal";
  const token = jwt.sign(
    {
      id: user?.id,
      role: user?.role,
      ...(user?.instituteId && { instituteId: user.instituteId }),
    },
    secret
  );
  return token;
};

const login = async (req, res) => {
  try {
    let credential = _.pick(req.body, ["username", "password"]);

    if (credential.username && credential.password) {
      let user = await User.query().findOne({ username: credential.username });
      if (!user) {
        return res.status(401).send("Invalid username or password.");
      }

      const validPassword = await bcrypt.compare(
        credential.password,
        user.password
      );
      if (!validPassword) {
        return res.status(401).send("Invalid username or password.");
      }

      if (!user.isActive) {
        return res.status(401).send("Id Disabled");
      }

      if (user.role == ("Headmaster" || "Teacher")) {
        let teacher = await Teacher.query().findOne({ userId: user.id });

        if (teacher) {
          user.instituteId = teacher.instituteId;
        }
      }

      let token = generateAuthToken(user);

      return res.send(token);
    }

    return res.status(403).send("credential missing");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = { login };
