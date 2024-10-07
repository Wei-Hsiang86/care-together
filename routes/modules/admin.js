const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const noteController = require('../../controllers/note-controller')

router.get('/patients/:id/edit', adminController.editPatient)
router.get('/patients/:id', adminController.getPatient)
router.put('/patients/:id', adminController.putPatient)
router.delete('/patients/:id', adminController.deletePatient)
router.get('/patients', adminController.getPatients)

router.delete('/notes/:id', noteController.deleteNote)
router.post('/notes', noteController.postNote)

router.get('/users/:userId/allData', adminController.getAllData)
router.patch('/users/:userId', adminController.patchUser)
router.get('/users', adminController.getPatientList)

router.get('/', (req, res) => res.redirect('/admin/patients'))

module.exports = router
