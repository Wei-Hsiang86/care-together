const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const noteController = require('../../controllers/note-controller')
const recordController = require('../../controllers/record-controller')

router.get('/patients/:id/edit', adminController.editPatient)
router.get('/patients/:id', adminController.getPatient)
router.put('/patients/:id', adminController.putPatient)
router.delete('/patients/:id', adminController.deletePatient)
router.get('/patients', adminController.getPatients)

router.delete('/notes/:id', noteController.deleteNote)
router.post('/notes', noteController.postNote)

router.post('/users/danger', adminController.getPatientList)
router.get('/users/search', adminController.searchUser)
router.get('/users/:userId/allData', adminController.getAllData)
router.patch('/users/:userId', adminController.patchUser)
router.get('/users', adminController.getPatientList)

// router.get('/records/:id/edit', recordController.editRecord)
// router.put('/records/:id', recordController.putRecord)
// router.delete('/records/:id', recordController.deleteRecord)
router.get('/records/create/:userId', recordController.createRecord)
router.post('/records', recordController.postRecord)
// router.get('/records', recordController.getAllRecord)

router.get('/', (req, res) => res.redirect('/admin/patients'))

module.exports = router
