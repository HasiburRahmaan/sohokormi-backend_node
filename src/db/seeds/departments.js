/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex('table_name').del()
  await knex("departments").insert([
    { department: "Bangla" },
    { department: "English" },
    { department: "Mathematics" },
    { department: "Physics" },
    { department: "Chemstry" },
    { department: "Biology" },
    { department: "Accounting" },
    { department: "Sociology" },
    { department: "Religious Education" },
    { department: "Social Science" },
    { department: "Home Economics" },
    { department: "Physical Education" },
  ]);
};
