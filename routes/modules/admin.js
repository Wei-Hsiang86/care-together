const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const noteController = require('../../controllers/note-controller')
const recordController = require('../../controllers/record-controller')

router.get('/patients/all/:userId', adminController.getAllData)
router.get('/patients/:id/edit', adminController.editPatient)
router.get('/patients/:id', adminController.getPatient)
router.delete('/patients/:id', adminController.deletePatient)
router.put('/patients/:id', adminController.putPatient)
router.get('/patients', adminController.getPatients)

router.post('/abgCalculator', adminController.abgCalculate)
router.get('/abgCalculator', adminController.abgCalculator)

router.delete('/notes/:id', noteController.deleteNote)
router.post('/notes', noteController.postNote)

router.post('/users/danger', adminController.getPatientList)
router.get('/users/search', adminController.searchUser)
router.patch('/users/:userId', adminController.patchUser)
router.get('/users', adminController.getPatientList)

router.get('/records/create/:userId', recordController.createRecord)
router.get('/records/all/:userId', recordController.getAllRecord)
router.get('/records/:id/:userId/edit', recordController.getEditRecord)
router.delete('/records/:id', recordController.deleteRecord)
router.put('/records/:id', recordController.putRecord)
router.post('/records', recordController.postRecord)

router.get('/', (req, res) => res.redirect('/admin/patients'))

module.exports = router
