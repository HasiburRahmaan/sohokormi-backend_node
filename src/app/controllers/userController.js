const User = require("../models/user");

const createUserBySuperadmin = async () => {};
const getAllUser = async (req, res) => {
  try {
    let data = await User.query();
    return res.send(data);
  } catch (error) {}
};

module.exports = { createUserBySuperadmin, getAllUser };
