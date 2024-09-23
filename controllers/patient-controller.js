const { Patient, User } = require('../models')

const patientController = {
  getPatients: (req, res, next) => {
    Patient.findAll({
      where: {
        userId: req.user.id
      },
      raw: true
    })
      .then(patients => {
        // console.log(patients)
        const name = req.user.name
        res.render('patients', { patients, name })
      })

      .catch(err => next(err))
  },
  createPatient: (req, res) => {
    return res.render('create-patient')
  },
  postPatient: (req, res, next) => {
    const { temperature, heartRate, bloodPressure, gluac, glupc, description } = req.body
    const userId = req.user.id
    if (!temperature) throw new Error('必須填寫體溫')
    if (!heartRate) throw new Error('必須填寫心跳')
    if (!bloodPressure) throw new Error('必須填寫血壓')

    User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('使用者不存在')

        return Patient.create({
          temperature,
          heartRate,
          bloodPressure,
          gluac,
          glupc,
          description,
          userId
        })
      })
      .then(() => {
        req.flash('success_messages', '成功新增資料')
        res.redirect('/patients')
      })
      .catch(err => next(err))
  },
  getPatient: (req, res, next) => {
    Patient.findByPk(req.params.id, {
      raw: true
    })
      .then(patient => {
        if (!patient) throw new Error('查詢不到數據紀錄!')
        const name = req.user.name
        res.render('patient', { patient, name })
      })
      .catch(err => next(err))
  },
  editPatient: (req, res, next) => {
    Patient.findByPk(req.params.id, {
      raw: true
    })
      .then(patient => {
        if (!patient) throw new Error('查詢不到數據紀錄!')
        res.render('edit-patient', { patient })
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
        res.redirect('/patients')
      })
      .catch(err => next(err))
  },
  deletePatient: (req, res, next) => {
    return Patient.findByPk(req.params.id)
      .then(patient => {
        if (!patient) throw new Error('查詢不到數據紀錄!')
        return patient.destroy()
      })
      .then(() => res.redirect('/patients'))
      .catch(err => next(err))
  }
}
module.exports = patientController
