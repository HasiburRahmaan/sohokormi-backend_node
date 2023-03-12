const bcrypt = require("bcrypt");
require("dotenv").config();

const generatePassword = async (password) => {
  return await bcrypt.hash(password, process.env.BCRYPT_SALT_SOHOKORMI);
};

module.exports = generatePassword;
