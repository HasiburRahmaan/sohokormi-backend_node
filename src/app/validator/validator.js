const {
  isExists,
  isExistsInDatabase,
  isType,
} = require("./validatorFuncitons/functions");

async function validator(obj, validationRulesObj, customMessageObj) {
  let errorObj = {};
  let errorArray = [];

  let dbObj = {};
  for (let field in validationRulesObj) {
    let fieldValue = obj[field];
    for (let rule in validationRulesObj[field]) {
      if (rule === "required" && !isExists(fieldValue)) {
        errorMsgHandler(field, rule, `${field} required`);
      } else if (isExists(fieldValue)) {
        if (rule === "unique") {
          let { obj, status } = await isExistsInDatabase(
            fieldValue,
            ...validationRulesObj[field][rule].split(",")
          );
          if (status && obj && Object.keys(obj).length) {
            dbObj[field] = obj;
            errorMsgHandler(field, rule, `${field} already exists`);
          }
          break;
        }
        if (rule === "exists") {
          let { obj, status } = await isExistsInDatabase(
            fieldValue,
            ...validationRulesObj[field][rule].split(",")
          );
          if (!status || !obj || Object.keys(obj).length == 0) {
            errorMsgHandler(field, rule, `${field} does not exits`);
          } else {
            dbObj[field] = obj;
          }
          break;
        }
        if (
          rule === "maxLen" &&
          fieldValue?.toString().length > validationRulesObj[field][rule]
        ) {
          errorMsgHandler(
            field,
            rule,
            `${field} length must be under ${validationRulesObj[field][rule]}`
          );
        }
        if (
          rule === "minLen" &&
          fieldValue?.toString().length < validationRulesObj[field][rule]
        ) {
          errorMsgHandler(
            field,
            rule,
            `${field} length must be atleast ${validationRulesObj[field][rule]}`
          );
        }
        if (
          rule === "type" &&
          !isType(fieldValue, validationRulesObj[field][rule])
        ) {
          // console.log({ fieldValue, rule: validationRulesObj[field][rule] });
          errorMsgHandler(
            field,
            rule,
            `${field} type must be ${validationRulesObj[field][rule]}`
          );
        }
      }
    }
  }

  function errorMsgHandler(field, rule, msg) {
    let errorMsg =
      customMessageObj?.[field]?.[rule] ||
      customMessageObj?.[field]?.all ||
      msg;

    errorObj[field] = errorMsg;
    errorArray.push(errorMsg);
  }
  return {
    errorObj,
    errorArray,
    dbObj,
    isValid: errorArray?.length == 0,
  };
}

module.exports = { validator };

// let rules = {
//   username: {
//     required: true,
//     max: 100,
//     min: 1,
//     maxLen: 5,
//     minLen: 1,
//     unique: "columnName, tableName, exceptValue, primaryColumnName",
//     exists: "columnName, tableName",

//     gt: "value",
//     lt: "value",
//     gte: "value",
//     lte: "value",

//     type: "phone", // others types are [number, phone, date, email, boolean]
//   },
//   area: {
//     required: true,
//     exists: "areaName, areas",
//   },
// };

// validator({ area: "Amtai" }, rules, { username: {} }).then((res) =>
//   console.log({ res })
// );

/*





rules = {
    username: {
        required: true,
        max: 100,
        min: 1,
        maxLen: 5,
        minLen: 1,

        unique: "columnName, tableName, exceptValue, primaryColumnName",
        exists: "columnName, tableName"

        gt: value,
        lt: value,
        gte value,
        lte: value,

        type: 'phone'  // others types are [number, phone, date, email]
       
        startsWith: "content",
        endsWith: "content"
    }
}





*/
