/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema

    .dropTableIfExists("identifiers")
    .dropTableIfExists("departments")
    .dropTableIfExists("institutes")
    .dropTableIfExists("upazilas")
    .dropTableIfExists("districts")

    .dropTableIfExists("users")
    .dropTableIfExists("roles")
    .dropTableIfExists("teachers")
    .createTable("identifiers", function (table) {
      table.string("identifier", 5).primary();
      table.boolean("isUsed").defaultTo(false);
      table.timestamps(true, true, true);
    })
    .createTable("roles", function (table) {
      table.increments("id");
      table.string("role", 100).notNullable().unique();
      table.timestamps(true, true, true);
    })
    .createTable("departments", function (table) {
      table.increments("id");
      table.string("department", 255).unique();
      table.timestamps(true, true, true);
    })
    .createTable("districts", function (table) {
      table.increments("id");
      table.string("district", 255).unique();
      table.timestamps(true, true, true);
    })
    .createTable("upazilas", function (table) {
      table.increments("id");
      table.string("upazila", 255);
      table.integer("districtId").unsigned();
      table.foreign("districtId").references("id").inTable("districts");
      table.timestamps(true, true, true);
    })
    .createTable("institutes", function (table) {
      table.increments("id");
      table.integer("eiin").nullable().unique();
      table.string("identifier", 5).unique().notNullable();
      table.string("name", 255).notNullable();
      table.string("phone", 14);
      table.integer("upazilaId").unsigned().notNullable();
      table.foreign("upazilaId").references("id").inTable("upazilas");
      table.bigInteger("version").defaultTo(0);
      table.boolean("isActive").defaultTo(true);
      table.timestamps(true, true, true);
    })
    .createTable("users", function (table) {
      table.increments("id").unique();
      table.string("username", 50).notNullable().unique();
      table.string("password", 255).notNullable();
      table
        .string("role", 255)
        .notNullable()
        .references("role")
        .inTable("roles");
      table.boolean("isActive").defaultTo(true);
      table.timestamps(true, true, true);
    })
    .createTable("teachers", function (table) {
      table.integer("userId").unsigned().primary().unique();
      table.integer("instituteId").unsigned().notNullable();
      table.string("phone", 14).notNullable();
      table.string("name", 255).notNullable();
      table.string("department", 255).nullable();
      table.integer("departmentId", 255).unsigned().nullable();
      table.integer("createdBy").unsigned();
      table.boolean("isDeleted").defaultTo(false);

      table.unique(["phone", "instituteId"]);
      table.foreign("userId").references("id").inTable("users");
      table.foreign("createdBy").references("id").inTable("users");
      table.foreign("instituteId").references("id").inTable("institutes");
      table.foreign("departmentId").references("id").inTable("departments");

      table.timestamps(true, true, true);
    })
    .createTable("schoolTeacherCreateLogs", function (table) {
      table.increments("id");
      table.integer("userId").unsigned();
      table.integer("instituteId").unsigned().notNullable();
      table.foreign("userId").references("id").inTable("users");
      table.foreign("instituteId").references("id").inTable("institutes");
      table.timestamps(true, true, true);
    })
    .createTable("schoolTeacherDeleteLogs", function (table) {
      table.increments("id");
      table.integer("userId").unsigned();
      table.integer("instituteId").unsigned().notNullable();
      table.string("reason", 1000).notNullable();
      table.foreign("userId").references("id").inTable("users");
      table.foreign("instituteId").references("id").inTable("institutes");
      table.timestamps(true, true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("identifiers")
    .dropTableIfExists("teachers")
    .dropTableIfExists("departments")
    .dropTableIfExists("institutes")
    .dropTableIfExists("upazilas")
    .dropTableIfExists("districts")
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};
