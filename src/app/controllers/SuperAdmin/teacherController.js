const _ = require("lodash");
const generatePassword = require("../../../utils/generatePassword");
const { validator } = require("../../validator/validator.js");

const { UNPROCCESSABLE_DATA } = require("../../../utils/statusCode");
const Department = require("../../models/department");

const Institute = require("../../models/institute");
const Teacher = require("../../models/teacher");
const User = require("../../models/user");

class TeacherController {
  static getAllTeacherByIdentifier = async (req, res) => {
    try {
      let identifier = req?.headers?.identifier;

      if (identifier) {
        let institute = await Institute.query()
          .leftJoin("upazilas", "upazilas.id", "institutes.upazilaId")
          .leftJoin("districts", "districts.id", "upazilas.districtId")
          .findOne({ identifier })
          .select(
            "institutes.id as id",
            "eiin",
            "identifier",
            "name",
            "phone",
            "upazilaId",
            "upazilas.upazila",
            "districtId",
            "districts.district",
            "version",
            "isActive"
          );
        if (institute?.id) {
          let data = await Teacher.query()
            .leftJoin("users", "users.id", "teachers.userId")
            .leftJoin("roles", "roles.id", "users.roleId")
            .leftJoin("departments", "teachers.departmentId", "departments.id")
            .leftJoin(
              "designations",
              "teachers.designationId",
              "designations.id"
            )
            .where({ instituteId: institute.id })
            .select(
              "userId",
              "name",
              "phone",
              "users.roleId",
              "roles.role",
              "department",
              "departmentId",
              "designation",
              "designationId",
              "instituteId"
            );
          return res.send({ institute, teachers: data });
        }
      }
      return res.status(404).send("no data found");
    } catch (error) {
      console.log("error====>", error);
      return res.status(500).send(error);
    }
  };

  static createTeacherBySuperAdmin = async (req, res) => {
    let users = [];
    let teachers = [];

    try {
      let instituteId = req?.body?.instituteId;
      let teacherArrayFromRequest = req?.body?.teachers;

      if (instituteId && teacherArrayFromRequest?.length) {
        let institute = await Institute.query().findOne({
          id: instituteId,
          isActive: true,
        });

        if (institute) {
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
              createdBy: req.user.id,
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

          return res.send("created");
        }

        return res
          .status(UNPROCCESSABLE_DATA)
          .send({ message: ["No institue"] });
      }

      return res
        .status(UNPROCCESSABLE_DATA)
        .send({ message: ["Teacher info not found"] });
    } catch (error) {
      console.log(error);

      /* Deleting Newly created Users if any error occured */
      await User.query()
        .whereIn(
          "id",
          users.filter((e) => (e.id ? true : false)).map((e) => e.id)
        )
        .delete();
      return res.status(500).send(error);
    }
  };

  static createHeadmasterBySuperAdmin = async (req, res) => {
    let user = null;
    try {
      let obj = _.pick(req.body, [
        "instituteId",
        "name",
        "phone",
        "departmentId",
        "designationId",
      ]);

      /* Check if this institute already has any headmaster */
      let headmaster = await Teacher.query()
        .join("users", "users.id", "teachers.userId")
        .where({
          "users.roleId": 2,
          "teachers.instituteId": obj.instituteId,
        });

      if (headmaster.length) {
        return res.status(UNPROCCESSABLE_DATA).send({
          message: ["headmaster already assigned for this institute"],
        });
      }

      /* Validating Data */
      let validation = await validator(obj, {
        instituteId: { required: true, exists: "id, institutes" },
        departmentId: { required: true, exists: "id, departments" },
        phone: { required: true, type: "phone" },
        name: { required: true },
      });

      if (!validation.isValid) {
        return res.status(UNPROCCESSABLE_DATA).send({
          message: validation.errorArray,
        });
      }

      let institute = validation.dbObj?.instituteId;

      /* check if phone number already exists for this institution */
      let teacherArrayFromDB = await Teacher.query().where({
        instituteId: institute.id,
        phone: obj.phone,
      });

      if (teacherArrayFromDB.length) {
        return res.status(UNPROCCESSABLE_DATA).send({
          message: ["phone already exists in this institution"],
        });
      }

      user = await User.query().insert({
        username: `${institute.identifier}_${obj.phone}`,
        password: await generatePassword(obj.phone),
        roleId: 2,
      });
      let teacher = await Teacher.query().insert({
        ...obj,
        userId: user.id,
      });

      return res.send({ teacher });
    } catch (error) {
      console.log(error);
      if (user && user.id) {
        await User.query().where({ id: user.id }).delete();
      }
      return res.status(500).send(error);
    }
  };

  static updateUserBySuperAdmin = async (req, res) => {
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

      let department = validation.dbObj?.departmentId;
      let institute = await Institute.query().findById(
        validation.dbObj.userId.instituteId
      );

      if (!institute || !institute.isActive) {
        return res.status(UNPROCCESSABLE_DATA).send({
          message: ["institute is not active"],
        });
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

      let teacherObj = { ...obj, department: department.department };
      let userObj = { username: `${institute.identifier}_${obj.phone}` };

      await Teacher.query().where({ userId: obj.userId }).update(obj);
      await User.query().where({ id: obj.userId }).update(userObj);

      return res.send({ teacherObj });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  };

  static changeUsersPasswordBySuperAdmin = async (req, res) => {
    try {
      let obj = _.pick(req.body, ["userId", "password"]);

      let validation = await validator(obj, {
        userId: { required: true, exists: "id, users" },
        password: { required: true },
      });

      if (!validation.isValid) {
        return res
          .status(UNPROCCESSABLE_DATA)
          .send({ message: validation.errorArray });
      }

      await User.query()
        .where({ id: obj.userId })
        .update({ password: await generatePassword(obj.password.toString()) });

      return res.send({ message: "password updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  };
}

module.exports = TeacherController;
