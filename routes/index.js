const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const patientController = require('../controllers/patient-controller')

const upload = require('../middleware/multer')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('photo'), userController.putUser) // 注意 single 內參數名稱，要與 form 表單 name 屬性名稱一致

router.get('/patients/create', authenticated, patientController.createPatient)
router.get('/patients/:id/edit', authenticated, patientController.editPatient)
router.get('/patients/:id', authenticated, patientController.getPatient)
router.put('/patients/:id', authenticated, patientController.putPatient)
router.delete('/patients/:id', authenticated, patientController.deletePatient)
router.get('/patients', authenticated, patientController.getPatients)
router.post('/patients', authenticated, patientController.postPatient)

router.get('/', (req, res) => { res.redirect('/patients') })
router.use('/', generalErrorHandler)

module.exports = router
