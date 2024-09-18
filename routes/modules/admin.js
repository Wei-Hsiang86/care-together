const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/patients', adminController.getPatients)

router.get('/', (req, res) => res.redirect('/admin/patients'))

module.exports = router
