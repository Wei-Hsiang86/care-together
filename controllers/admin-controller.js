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
    return Patient.findByPk(req.params.id, {
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

    return Patient.findByPk(req.params.id)
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
  getPatientList: (req, res, next) => {
    const defaultLimit = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || defaultLimit
    const offset = getOffset(limit, page)
    const { showDanger } = req.body

    return User.findAndCountAll({
      where: showDanger ? { danger: 1 } : { isAdmin: 0 },
      attributes: {
        exclude: ['password']
      },
      limit,
      offset,
      raw: true
    })
      .then(list => {
        const patientList = list.rows.map((item, index) => ({
          ...item,
          itemN: index + 1
        }))
        res.render('admin/patient-list', {
          patientList,
          pagination: getPagination(limit, page, list.count),
          needPaginate: true,
          noContent: !patientList.length
        })
      })
      .catch(err => next(err))
  },
  searchUser: (req, res, next) => {
    const keyword = req.query.adminSearchUser.trim()
    if (!keyword) throw new Error('Please enter name.')
    if (keyword === req.user.name) throw new Error('Cannot search yourself.')

    return User.findOne({
      where: {
        name: keyword
      },
      raw: true
    })
      .then(searchedUser => {
        if (!searchedUser) throw new Error('Cannot find the patient.')
        console.log(searchedUser)
        return res.render('admin/patient-list', {
          keyword,
          patientList: [searchedUser],
          needPaginate: false
        })
      })
  },
  patchUser: (req, res, next) => {
    const userId = req.params.userId
    const { isDanger } = req.body
    console.log(userId, isDanger)

    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('User is not exist!')
        if (user.isAdmin === 1) {
          req.flash('error_messages', 'Cannot set root to danger!')
          return res.redirect('back')
        }
        return user.update({
          danger: !user.danger
        })
      })
      .then(() => res.redirect('/admin/users'))
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
      .catch(err => next(err))
  },
  abgCalculator: (req, res, next) => {
    res.render('admin/abg-calculator')
  }
}
module.exports = adminController
