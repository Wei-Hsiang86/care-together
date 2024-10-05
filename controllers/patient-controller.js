const { Patient, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const patientController = {
  getPatients: (req, res, next) => {
    const defaultLimit = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || defaultLimit
    const offset = getOffset(limit, page)
    return Patient.findAndCountAll({
      where: {
        userId: req.user.id
      },
      attributes: {
        exclude: ['description']
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      raw: true
    })
      .then(rawPatientData => {
        const patientData = rawPatientData.rows.map((item, index) => ({
          ...item,
          itemN: index + offset + 1
        }))
        const name = req.user.name
        res.render('patients', {
          patients: patientData,
          name,
          pagination: getPagination(limit, page, rawPatientData.count)
        })
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
    const viewRight = req.user.Friends.map(id => id.fid)
    viewRight.push(req.user.id)

    return Patient.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Comment, include: User }
      ]
    })
      .then(rawPatientData => {
        if (!rawPatientData) throw new Error('查詢不到數據紀錄!')

        const patient = rawPatientData.toJSON()
        if (!viewRight.includes(patient.userId)) {
          req.flash('error_messages', '只能查看自己或是朋友的紀錄!')
          return res.redirect('/patients')
        }
        res.render('patient', { patient })
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
