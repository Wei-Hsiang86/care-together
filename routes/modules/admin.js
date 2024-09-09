const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/users', adminController.getUsers)

router.get('/', (req, res) => res.redirect('/admin/users'))

module.exports = router
