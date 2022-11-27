/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

let districts = require("../../jsons/districts.json");
let upazillas = require("../../jsons/upazillas.json");

let districtArray = districts.map((e) => {
  return { id: e.id, district: e.name };
});
let upazillaArray = upazillas.map((e) => ({
  id: e.id,
  upazila: e.name,
  districtId: e.district_id,
}));

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex("districts").del();
  await knex("districts").insert(districtArray);

  // await knex("upazilas").del();
  await knex("upazilas").insert(upazillaArray);
};
