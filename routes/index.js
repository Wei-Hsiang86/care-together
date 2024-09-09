const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const vsignController = require('../controllers/vsign-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/vsigns', vsignController.getVsigns)

router.get('/', (req, res) => { res.redirect('/vsigns') })
router.use('/', generalErrorHandler)

module.exports = router
