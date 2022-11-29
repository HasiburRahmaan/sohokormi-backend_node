let knexConfig = require("../../knexfile.js");
let knex = require("knex")(knexConfig);

async function existsInTable({ value, tableName, columnName }) {
  try {
    if (value && tableName && columnName) {
      let data = await knex(tableName).where(columnName, value);

      return data.length > 0;
    }
  } catch (error) {
    console.log(error);
    throw new Error("DB error");
  }
}
async function uniqueInTable({
  value,
  tableName,
  columnName,
  primaryKeyColumnName = "id",
  primaryKeyValue,
}) {
  try {
    if (value && tableName && columnName) {
      let data;

      if (primaryKeyValue) {
        data = await knex(tableName)
          .where(columnName, value)
          .where(primaryKeyColumnName, "!=", null);
      } else {
        data = await knex(tableName).where(columnName, value);
      }

      return data.length > 0;
    }
  } catch (error) {
    console.log(error);
    throw new Error("DB error");
  }
}

module.exports = { existsInTable };
