const Teacher = require("../models/teacher");
const _ = require("lodash");
const Institute = require("../models/institute");
const generatePassword = require("../../utils/generatePassword");
const User = require("../models/user");
const Department = require("../models/department");

const { teacherValidator } = require("../modelValidators/teacherValidation");

const createTeacherFunction = async (obj, req) => {
  let teacher, user;
  try {
    let errors = {};
    errors = await teacherValidator(obj);
    if (Object.keys(errors).length) {
      return { ...errors };
    }

    let institute = await Institute.query().findOne({
      id: obj.instituteId,
      isActive: true,
    });
    if (!institute) {
      errors = { ...errors, institute: "institute does not exists" };
      return { errors };
    }

    let department = await Department.query().findOne({
      id: obj.departmentId,
    });

    if (!department) {
      errors = { ...errors, department: "department does not exists" };
      return { errors };
    }

    let phone = await Teacher.query().findOne({
      phone: obj.phone,
      instituteId: institute.id,
    });

    if (phone) {
      errors = {
        ...errors,
        phone: "phone already exists in this institute's phonebook",
      };
      return { errors };
    }

    let userObj = {
      username: `${institute.eiin}_${obj.phone}`,
      password: await generatePassword(obj.password),
      role: obj.role,
    };

    if (userObj.role == "Headmaster") {
      let user = await User.query()
        .join("teachers", "teachers.userId", "=", "users.id")
        .where("users.role", "Headmaster")
        .where("teachers.instituteId", institute.id);

      if (user.length) {
        errors = {
          ...errors,
          user: "headmaster already exists for this institution",
        };
        return { errors };
      }
    }
    user = await User.query().insert(userObj);

    let teacherObj = {
      userId: user.id,
      instituteId: institute.id,
      phone: obj.phone,
      name: obj.name,
      department: department?.department,
      createdBy: req.user.id,
    };

    teacher = await Teacher.query().insert(teacherObj);

    await Institute.query()
      .update({ version: institute.version + 1 })
      .where({ id: institute.id });

    return { user, teacher, errors };
  } catch (errors) {
    console.log("error====>", error);
    if (user?.id) {
      await User.query().where({ id: user.id }).delete();
    }
    if (teacher?.userId) {
      await Teacher.query().where({ userId: user.id }).delete();
    }

    return { errors };
  }
};

const createTeacherBySuperAdmin = async (req, res) => {
  let teacher, user;
  try {
    let obj = _.pick(req.body, [
      "phone",
      "password",
      "name",
      "role",
      "instituteId",
      "departmentId",
    ]);
    let { teacher, user, errors } = await createTeacherFunction(obj, req);
    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }
    res.status(200).send("created");
  } catch (error) {
    console.log("error====>", error);
    if (user?.id) {
      await User.query().where({ id: user.id }).delete();
    }
    if (teacher?.userId) {
      await Teacher.query().where({ userId: user.id }).delete();
    }

    return res.status(500).send(error);
  }
};

const createTeacherByHeadmaster = async (req, res) => {
  try {
    let obj = _.pick(req.body, ["phone", "password", "name", "departmentId"]);
    obj.role = "Teacher";
    obj.instituteId = req.user.instituteId;
    let { teacher, user, errors } = await createTeacherFunction(obj, req);
    if (Object.keys(errors).length) {
      return res.status(403).send({ errors });
    }
    return res.status(200).send("created");
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  createTeacherBySuperAdmin,
  createTeacherByHeadmaster,
};
