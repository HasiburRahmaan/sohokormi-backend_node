/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("identifiers", function (table) {
      table.string("identifier", 5).primary();
      table.boolean("isUsed").defaultTo(false);
    })
    .alterTable("institutes", function (table) {
      table.string("identifier", 5).unique().notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("identifiers")
    .alterTable("institutes", function (table) {
      table.dropColumn("identifier");
    });
};
