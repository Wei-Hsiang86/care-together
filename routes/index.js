const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const patientController = require('../controllers/patient-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/patients/create', patientController.createPatient)
router.get('/patients', authenticated, patientController.getPatients)
router.post('/patients', authenticated, patientController.postPatient)

router.get('/', (req, res) => { res.redirect('/patients') })
router.use('/', generalErrorHandler)

module.exports = router
