const { Patient } = require('../models')

const patientController = {
  getPatients: (req, res, next) => {
    Patient.findAll({
      raw: true
    })
      .then(patients => {
        // console.log(patients)
        res.render('patients', { patients })
      })

      .catch(err => next(err))
  },
  createPatient: (req, res) => {
    return res.render('create-patient')
  },
  postPatient: (req, res, next) => {
    const { temperature, heartRate, bloodPressure, gluac, glupc, description } = req.body
    if (!temperature) throw new Error('必須填寫體溫')
    if (!heartRate) throw new Error('必須填寫心跳')
    if (!bloodPressure) throw new Error('必須填寫血壓')

    Patient.create({
      temperature,
      heartRate,
      bloodPressure,
      gluac,
      glupc,
      description
    })
      .then(() => {
        req.flash('success_messages', '成功新增資料')
        res.redirect('/patients')
      })
      .catch(err => next(err))
  }
}
module.exports = patientController
