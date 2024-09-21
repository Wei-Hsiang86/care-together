const { Patient, User } = require('../models')

const adminController = {
  getPatients: (req, res, next) => {
    Patient.findAll({
      raw: true,
      nest: true,
      include: [User]
    })
      .then(patients => {
        // console.log(patients)
        res.render('admin/patients', { patients })
      })

      .catch(err => next(err))
  },
  getPatient: (req, res, next) => {
    Patient.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [User]
    })
      .then(patient => {
        if (!patient) throw new Error('查詢不到數據紀錄!')
        res.render('admin/patient', { patient })
      })
      .catch(err => next(err))
  },
  editPatient: (req, res, next) => {
    Patient.findByPk(req.params.id, {
      raw: true
    })
      .then(patient => {
        if (!patient) throw new Error('查詢不到數據紀錄!')
        res.render('admin/edit-patient', { patient })
      })
      .catch(err => next(err))
  },
  putPatient: (req, res, next) => {
    const { temperature, heartRate, bloodPressure, gluac, glupc, description } = req.body
    if (!temperature) throw new Error('必須填寫體溫')
    if (!heartRate) throw new Error('必須填寫心跳')
    if (!bloodPressure) throw new Error('必須填寫血壓')

    Patient.findByPk(req.params.id)
      .then(patient => {
        if (!patient) throw new Error('查詢不到數據紀錄!')

        return patient.update({
          temperature,
          heartRate,
          bloodPressure,
          gluac,
          glupc,
          description
        })
      })
      .then(() => {
        req.flash('success_messages', '成功更新資料')
        res.redirect('/admin/patients')
      })
      .catch(err => next(err))
  },
  deletePatient: (req, res, next) => {
    return Patient.findByPk(req.params.id)
      .then(patient => {
        if (!patient) throw new Error('查詢不到數據紀錄!')
        return patient.destroy()
      })
      .then(() => res.redirect('/admin/patients'))
      .catch(err => next(err))
  }
}
module.exports = adminController
