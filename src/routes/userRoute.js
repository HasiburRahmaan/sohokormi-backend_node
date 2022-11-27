const express = require("express");
const {
  createUserBySuperadmin,
  getAllUser,
} = require("../app/controllers/userController");
const router = express.Router();

router.post("/create", createUserBySuperadmin);
router.get("/all", getAllUser);

module.exports = router;
