const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/patients', authenticatedAdmin, adminController.getPatients)

router.get('/', (req, res) => res.redirect('/admin/patients'))

module.exports = router
