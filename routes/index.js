const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

router.get('/users', userController.getUsers)

router.get('/', (req, res) => { res.redirect('/users') })

module.exports = router
