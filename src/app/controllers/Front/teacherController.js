const _ = require("lodash");
const { validator } = require("../../validator/validator.js");

const Department = require("../../models/department.js");
const Institute = require("../../models/institute.js");
const Teacher = require("../../models/teacher.js");
const User = require("../../models/user.js");
const { UNPROCCESSABLE_DATA } = require("../../../utils/statusCode.js");
const generatePassword = require("../../../utils/generatePassword.js");
const DeletedUser = require("../../models/deletedUser.js");

class TeacherController {
  static getAllTeacherByIdentifier = async (req, res) => {
    try {
      let instituteId = req?.institute?.id;
      if (instituteId) {
        let data = await Teacher.query()
          .leftJoin("users", "users.id", "teachers.userId")
          .leftJoin("roles", "roles.id", "users.roleId")
          .leftJoin("departments", "departments.id", "teachers.departmentId")
          .leftJoin("designations", "designations.id", "teachers.designationId")
          .where({ instituteId, isDeleted: false })
          .select(
            "userId",
            "name",
            "phone",
            "role",
            "departmentId",
            "departments.department",
            "designationId",
            "designations.designation",
            "instituteId"
          );
        return res.send(data);
      }
      return res.send([]);
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };

  static createTeacherByHeadmaster = async (req, res) => {
    let users = [];
    try {
      let adminUser = req?.user;
      let institute = await Institute.query()
        .join("teachers", "teachers.instituteId", "institutes.id")
        .join("users", "users.id", "teachers.userId")
        .findOne({ "teachers.userId": req.user.id, "teachers.isDeleted": 0 });

      let teacherArrayFromRequest = req?.body?.teachers;

      if (institute && teacherArrayFromRequest?.length) {
        let teachers = [];
        let teacherValidations = [];
        let departments = new Set();

        for (let i = 0; i < teacherArrayFromRequest.length; i++) {
          let teacher = teacherArrayFromRequest[i];

          teachers.push({
            ..._.pick(teacher, [
              "phone",
              "name",
              "departmentId",
              "designationId",
            ]),
            instituteId: institute.id,
            createdBy: adminUser.id,
          });

          let validation = await validator(teacher, {
            phone: { required: true, type: "phone" },
            name: { required: true },
          });

          if (!validation.isValid) {
            teacherValidations.push(
              ...validation.errorArray.map(
                (error) => `object ${i + 1}.  ${error}`
              )
            );
          }

          users.push({
            username: `${institute.identifier}_${teacher.phone}`,
            password: await generatePassword(teacher.phone),
            roleId: 3,
          });

          departments.add(teacher.departmentId);
        }

        if (teacherValidations.length) {
          return res
            .status(UNPROCCESSABLE_DATA)
            .send({ message: teacherValidations });
        }

        /* checking if all departments are present */
        let departmentFromDatabases = await Department.query().whereIn("id", [
          ...departments,
        ]);
        let departmentObj = {};
        departmentFromDatabases.map((department) => {
          departmentObj[department.id] = department.department;
        });

        if (departmentFromDatabases.length != departments.size) {
          return res
            .status(UNPROCCESSABLE_DATA)
            .send({ message: ["Some departments are not available"] });
        }

        /* checking if phone number already exists for this institution */
        let teachersFromDatabase = await Teacher.query()
          .where({ instituteId: institute.id })
          .whereIn(
            "phone",
            teachers.map((teacher) => teacher.phone)
          );

        if (teachersFromDatabase.length) {
          return res.status(UNPROCCESSABLE_DATA).send({
            message: [
              `${teachersFromDatabase
                .map((teacher) => teacher.phone)
                .join(" ")} already exitst`,
            ],
          });
        }

        /* creating users and assinging userId to teacher objects */
        let userArray = await User.query().insertGraph(users);
        let userArrayObj = {};
        userArray.map((user) => {
          userArrayObj[user.username.split("_")[1]] = user.id;
        });

        teachers = teachers.map((teacher) => {
          return {
            ...teacher,
            userId: userArrayObj[teacher.phone],
          };
        });
        let teacherArray = await Teacher.query().insertGraph(teachers);

        return res.status(200).send({ message: ["created"] });
      }

      return res
        .status(UNPROCCESSABLE_DATA)
        .send({ message: ["Institute or Teachers info not found"] });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };

  static updateUserByHeadmaster = async (req, res) => {
    try {
      let obj = _.pick(req.body, [
        "userId",
        "name",
        "phone",
        "departmentId",
        "designationId",
        "isDeleted",
      ]);

      let validation = await validator(obj, {
        userId: { required: true, exists: "userId, teachers" },
        departmentId: { required: true, exists: "id, departments" },
        designationId: { required: true, exists: "id, designations" },
        phone: { required: true, type: "phone" },
        isDeleted: { type: "boolean" },
        name: { required: true },
      });

      if (!validation.isValid) {
        return res.status(UNPROCCESSABLE_DATA).send({
          message: validation.errorArray,
        });
      }

      let institute = await Institute.query().findById(
        validation.dbObj.userId.instituteId
      );

      if (!institute || !institute.isActive) {
        return res.status(UNPROCCESSABLE_DATA).send({
          message: ["institute is not active"],
        });
      }

      /* Check If headmaster has authority to change this users information */
      let headmaster = await Teacher.query()
        .join("users", "users.id", "teachers.userId")
        .findOne({ "teachers.userId": req.user.id });

      if (headmaster.instituteId != institute.id) {
        return res.status(401).send({ message: ["unauthorized"] });
      }

      /* check if phone number already exists for this institution */
      let teacherArrayFromDB = await Teacher.query()
        .where({
          instituteId: institute.id,
          phone: obj.phone,
        })
        .whereNot({ userId: obj.userId });

      if (teacherArrayFromDB.length) {
        return res.status(UNPROCCESSABLE_DATA).send({
          message: ["phone already exists in this institution"],
        });
      }

      let teacherObj = {
        ...obj,
        department: validation.dbObj.departmentId.department,
        designation: validation.dbObj.designationId.designation,
      };
      let userObj = { username: `${institute.identifier}_${obj.phone}` };

      await Teacher.query().where({ userId: obj.userId }).update(obj);
      await User.query().where({ id: obj.userId }).update(userObj);
      return res.send(teacherObj);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };

  static deleteUsersByHeadmaster = async (req, res) => {
    try {
      let users = req?.body?.users;
      let reason = req?.body?.reason;

      if (users.length) {
        let adminUser = req?.user;
        let institute = await Institute.query()
          .join("teachers", "teachers.instituteId", "institutes.id")
          .join("users", "users.id", "teachers.userId")
          .findOne({
            "teachers.userId": adminUser.id,
            "teachers.isDeleted": 0,
          });

        let teachers = await Teacher.query()
          .join("users", "users.id", "teachers.userId")
          .join("roles", "roles.id", "users.roleId")
          .where({ "teachers.instituteId": institute.id })
          .whereNot("users.roleId", 2)
          .whereIn("teachers.userId", users);

        let usersEligableForDelete = teachers.map((e) => e.userId);

        let teachersData = teachers.map((teacher) => ({
          deletedBy: adminUser.id,
          instituteId: teacher.instituteId,
          phone: teacher.phone,
          name: teacher.name,
          reason: reason,
          departmentId: teacher.departmentId,
          designationId: teacher.designationId,
        }));

        await DeletedUser.query().insertGraph(teachersData);
        await Teacher.query()
          .whereIn("userId", usersEligableForDelete)
          .delete();
        await User.query().whereIn("id", usersEligableForDelete).delete();
      }
      return res.status(200).send("deleted");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };
}

module.exports = TeacherController;
