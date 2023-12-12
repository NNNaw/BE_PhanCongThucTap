var express = require("express");
const { upload, checkContentFileUploads } = require("../multer");
var router = express.Router();

const controller = require("./../_controllers/admin.controller");

router.get("/infoTeacher", controller.getAllTeacher);

router.get("/infoMentor", controller.getAllMentor);

router.get("/infoTeacher/:idGV", controller.getInfoTeacher);
router.get("/infoMentor/:idNV", controller.getInfoMentor);
router.get("/getAllStudentConfirm/:idGV", controller.getAllStudentConfirm);

router.get(
  "/getAllStudentWaitingAddMission/:idGV",
  controller.getAllStudentWaitingAddMission
);
router.get(
  "/getDetailStudentWaitingAddMission/:idSV",
  controller.getDetailStudentWaitingAddMission
);
router.get(
  "/getListTeacherAndQuantityStudent",
  controller.getListTeacherAndQuantityStudent
);
router.get(
  "/getQuantityStudentByIdTeacher/:idGV",
  controller.getQuantityStudentByIdTeacher
);

router.get(
  "/getTotalTopicByIdTeacher/:idGV",
  controller.getTotalTopicByIdTeacher
);

router.get("/getListTodoListByTeach/:idGV", controller.getListTodoListByTeach);

router.post("/addTopic", controller.addTopic);
router.post("/addAssignmentToTeach/:taiKhoan", controller.addAssignmentToTeach);

router.post("/confirmTopicRegister", controller.confirmTopicRegister);

router.post("/createMission", controller.createMission);
router.post("/addMission", controller.addMission);

router.post(
  "/insertFileData",
  checkContentFileUploads,
  controller.insertFileData
);

router.patch("/addMark", controller.addMark);

router.patch("/rateStudentByMentor", controller.rateStudentByMentor);

router.patch("/comfirmRegisterTopic/:idGV", controller.comfirmRegisterTopic);
router.patch("/denyRegisterTopic/:idGV", controller.denyRegisterTopic);
module.exports = router;
