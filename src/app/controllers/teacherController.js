const Teacher = require("../models/teacher");
const _ = require("lodash");
const Institute = require("../models/institute");
const generatePassword = require("../../utils/generatePassword");
const User = require("../models/user");
const Department = require("../models/department");

const createTeacherFunction = async (obj) => {};
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

    /* validation will be written later here

      * user object validation
      * role validation
      * institute validation
      * others

    */

    let institute = await Institute.query().findById(obj.instituteId);
    let department = await Department.query().findById(obj.departmentId);

    let userObj = {
      username: `${institute.eiin}_${obj.phone}`,
      password: await generatePassword(obj.password),
      role: obj.role,
    };

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
    return res.send(teacher);
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
  let teacher, user;
  try {
    let obj = _.pick(req.body, ["phone", "password", "name", "departmentId"]);
    /* validation will be written later here

      * user object validation
      * role validation
      * institute validation
      * others

    */
    // return res.send(req.user);
    let institute = await Institute.query().findById(req.user.instituteId);
    let department = await Department.query().findById(obj.departmentId);

    let userObj = {
      username: `${institute.eiin}_${obj.phone}`,
      password: await generatePassword(obj.password),
      role: "Teacher",
    };

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

    return res.send(teacher);
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
const createTeacher = async (req, res) => {
  try {
    let userObj = _.pick(req.body, ["username", "password", "role"]);
    return res.send(data);
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send(error);
  }
};
const getAllTeacherByInstitute = async (req, res) => {
  try {
    let user = req.user;
    if (user?.instituteId) {
      let data = await Teacher.query()
        .where({ instituteId: user.instituteId })
        .select("userId", "name", "phone", "department", "instituteId");
      return res.send(data);
    }
    return res.send([]);
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  createTeacher,
  createTeacherBySuperAdmin,
  createTeacherByHeadmaster,
  getAllTeacherByInstitute,
};
