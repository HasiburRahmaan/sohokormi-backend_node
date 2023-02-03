// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { knexSnakeCaseMappers } = require("objection");

require("dotenv").config();
let migrationAndSeedLocation = {
  migrations: {
    directory: "./src/db/migrations",
  },
  seeds: {
    directory: "./src/db/seeds",
  },
  ...knexSnakeCaseMappers,
};
const knex = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "localhost",
      database: process.env.DB_NAME || "phone_number_portal",
      user: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "root",
    },
    migrations: {
      tableName: "knex_migrations",
    },
    ...migrationAndSeedLocation,
  },

  production: {
    client: "mysql2",
    connection: {
      host: "localhost",
      database: "phone_number_portal",
      user: "root",
      password: "root",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    ...migrationAndSeedLocation,
  },
};

module.exports = knex.production;
