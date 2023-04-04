/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require("bcrypt");
require("dotenv").config();
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex("roles").del();
  await knex("roles").insert([
    { id: 1, role: "SuperAdmin" },
    { id: 2, role: "Headmaster" },
    { id: 3, role: "Teacher" },
  ]);

  await knex("users").insert([
    {
      username: "admin",
      password: await bcrypt.hash("123456", process.env.BCRYPT_SALT_SOHOKORMI),
      roleId: "1",
    },
  ]);
};
