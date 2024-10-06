const { Patient, User, Note } = require('../models')
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
        if (!rawPatientData) throw new Error('There is not any data!')
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
    return Patient.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Note, include: User }
      ]
    })
      .then(rawPatientData => {
        if (!rawPatientData) throw new Error('Cannot find patient data!')
        const patient = rawPatientData.toJSON()
        const tab = { dataId: patient.id, userId: patient.userId }
        res.render('admin/patient', { patient, tab })
      })
      .catch(err => next(err))
  },
  editPatient: (req, res, next) => {
    Patient.findByPk(req.params.id, {
      raw: true
    })
      .then(patient => {
        if (!patient) throw new Error('Cannot find patient data!')
        res.render('admin/edit-patient', { patient })
      })
      .catch(err => next(err))
  },
  putPatient: (req, res, next) => {
    const { temperature, heartRate, bloodPressure, gluac, glupc, description } = req.body
    if (!temperature) throw new Error('Require temperature!')
    if (!heartRate) throw new Error('Require heart rate!')
    if (!bloodPressure) throw new Error('Require blood pressure!')

    Patient.findByPk(req.params.id)
      .then(patient => {
        if (!patient) throw new Error('Cannot find patient data!')

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
        req.flash('success_messages', 'Update success!')
        res.redirect('/admin/patients')
      })
      .catch(err => next(err))
  },
  deletePatient: (req, res, next) => {
    return Patient.findByPk(req.params.id)
      .then(patient => {
        if (!patient) throw new Error('Cannot find patient data!')
        return patient.destroy()
      })
      .then(() => res.redirect('/admin/patients'))
      .catch(err => next(err))
  },
  getAllData: (req, res, next) => {
    const searchId = req.params.userId
    const defaultLimit = 5
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || defaultLimit
    const offset = getOffset(limit, page)

    return Promise.all([
      User.findByPk(searchId),
      Patient.findAndCountAll({
        where: {
          userId: searchId
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        raw: true
      })
    ])
      .then(([user, rawPatientData]) => {
        if (!user) throw new Error('User does not exist!')
        if (!rawPatientData) throw new Error('There is not any data!')
        const userProfile = user.toJSON()
        const tab = { userId: searchId }
        const patientData = rawPatientData.rows.map((item, index) => ({
          ...item,
          itemN: index + offset + 1
        }))
        res.render('admin/all-data', {
          userProfile,
          patient: patientData,
          pagination: getPagination(limit, page, rawPatientData.count),
          tab
        })
      })
  }
}
module.exports = adminController
