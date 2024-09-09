const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')

router.use('/admin', admin)

router.get('/users', userController.getUsers)

router.use('/', (req, res) => { res.redirect('/users') })

module.exports = router
