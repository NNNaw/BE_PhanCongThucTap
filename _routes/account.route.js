var express = require('express')
var router = express.Router()


const controller = require('./../_controllers/account.controller');


router.get('/', controller.getAccounts)
router.get('/getAccountsConfirmed', controller.getAccountsConfirmed)
router.get('/getAccountsUnconfirm', controller.getAccountsUnconfirm)
router.get('/getNotifyByAccount/:taiKhoan', controller.getNotifyByAccount)
router.patch('/markReadNotifyByAccount/:taiKhoan', controller.markReadNotifyByAccount)


router.get('/getDetailListStudentWaitingAssignment', controller.getDetailListStudentWaitingAssignment)



router.post('/register', controller.Register);
// router.post('/registerEmployee', controller.RegisterEmployee);

router.post('/login', controller.Login);


router.patch('/conFirmAccountByAdmin', controller.conFirmAccountByAdmin);

module.exports = router