const { isDate, isNumber } = require("lodash");
let knexConfig = require("../../../../knexfile.js");
let knex = require("knex")(knexConfig);

let isExists = (value) => {
  return !(typeof value === "undefined" || value === null);
};

let isAllArgumentExists = (...args) => {
  let exists = args.reduce((value, e) => value && isExists(e), true);
  return exists;
};

let isExistsInDatabase = async (
  value,
  columnName,
  tableName,
  exceptValue,
  primaryColumnName
) => {
  try {
    let obj = null;
    if (
      isAllArgumentExists(
        value,
        columnName,
        tableName,
        exceptValue,
        primaryColumnName
      )
    ) {
      obj = await knex(tableName)
        .where(columnName, value)
        .whereNot(primaryColumnName, exceptValue)
        .first();
    } else if (isAllArgumentExists(value, columnName, tableName)) {
      obj = await knex(tableName).where(columnName, value).first();
    }

    return { obj, status: true };
  } catch (error) {
    console.log({ error });
    return { obj: null, status: false };
  }
};

let isPhone = (value) => {
  if (value) {
    if (!value.startsWith("01") || value.length != 11) {
      return false;
    }
  }
  return true;
};

let isType = (value, type) => {
  switch (type) {
    case "boolean":
      return value === "true" || value == 1 || value === "false" || value == 0;
    case "date":
      return isDate(value);
    case "number":
      return isNumber(value);
    case "phone":
      return isPhone(value);
    default:
      return true;
      break;
  }
};

module.exports = { isExists, isExistsInDatabase, isType };
