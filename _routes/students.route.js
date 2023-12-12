var express = require('express')
var router = express.Router()
const { upload, checkContentFileUploads } = require('./../multer')

const controller = require('./../_controllers/student.controller');


router.get('/', controller.getStudents)

router.get('/:idSV', controller.getStudentByID)

router.get('/getListStudentByTopic/:idDeTai', controller.getListStudentByTopic)


router.get('/getAssignmenById/:idSV', controller.getAssignmenById)
router.get('/getAssignmenStudentNotDone/:idGV/:idSV', controller.getAssignmenStudentNotDone)

router.post('/registerTopic', controller.registerTopic)

router.post('/submitFile',checkContentFileUploads, controller.submitFile)

router.get('/downloadFile/:filePath', controller.downloadFile)

router.delete('/cancleTopic', controller.cancleTopic)



module.exports = router