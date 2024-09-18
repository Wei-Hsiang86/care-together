const { Patient } = require('../models')

const patientController = {
  getPatients: (req, res, next) => {
    Patient.findAll({
      raw: true
    })
      .then(patients => {
        console.log(patients)
        res.render('patients', { patients })
      })

      .catch(err => next(err))
  }
}
module.exports = patientController
