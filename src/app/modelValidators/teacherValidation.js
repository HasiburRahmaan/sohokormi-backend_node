const { validator } = require("../../validators/validator.js");

async function teacherValidator(obj) {
  let rule = {
    instituteId: { required: true },
    phone: { required: true, type: "phone" },
    name: { required: true },
    role: { required: true },
    departmentId: { required: true },
  };

  let validation = validator(obj, rule);

  return validation;
}

module.exports = { teacherValidator };
