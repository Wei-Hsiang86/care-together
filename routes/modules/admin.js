const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const noteController = require('../../controllers/note-controller')

router.get('/patients/:id/edit', adminController.editPatient)
router.get('/patients/:id', adminController.getPatient)
router.put('/patients/:id', adminController.putPatient)
router.delete('/patients/:id', adminController.deletePatient)
router.get('/patients', adminController.getPatients)

// router.delete('/patients/:id/notes/:noteId', noteController.deleteNote)
router.post('/patients/:id/notes', noteController.postNote)

router.get('/', (req, res) => res.redirect('/admin/patients'))

module.exports = router
