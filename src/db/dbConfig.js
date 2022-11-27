const knex = require("knex");
const { Model } = require("objection");
const knexfile = require("../../knexfile.js");

module.exports = function () {
  const db = knex(knexfile);
  Model.knex(db);
};
