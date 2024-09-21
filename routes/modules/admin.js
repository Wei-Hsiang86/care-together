const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/patients/:id/edit', adminController.editPatient)
router.get('/patients/:id', adminController.getPatient)
router.put('/patients/:id', adminController.putPatient)
router.delete('/patients/:id', adminController.deletePatient)
router.get('/patients', adminController.getPatients)

router.get('/', (req, res) => res.redirect('/admin/patients'))

module.exports = router
