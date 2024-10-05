const { Patient, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const adminController = {
  getPatients: (req, res, next) => {
    const defaultLimit = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || defaultLimit
    const offset = getOffset(limit, page)
    return Patient.findAndCountAll({
      include: [
        { model: User, attributes: ['name'] }
      ],
      attributes: {
        exclude: ['description']
      },
      order: [
      // 先依照名字排，再依照時間排序
        [User, 'id', 'ASC'],
        ['createdAt', 'DESC']
      ],
      limit,
      offset,
      raw: true,
      nest: true
    })
      .then(rawPatientData => {
        const patientData = rawPatientData.rows.map((item, index) => ({
          ...item,
          itemN: index + offset + 1
        }))
        res.render('admin/patients', {
          patients: patientData,
          pagination: getPagination(limit, page, rawPatientData.count)
        })
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
