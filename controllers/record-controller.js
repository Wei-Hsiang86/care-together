const { Record, User, Patient } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const recordController = {
  createRecord: (req, res, next) => {
    const userId = req.params.userId
    return Promise.all([
      User.findByPk(userId, {
        attributes: {
          exclude: ['password']
        }
      }),
      Patient.findAll({
        where: {
          userId
        },
        attributes: {
          exclude: ['description']
        },
        order: [['createdAt', 'DESC']],
        limit: 5,
        raw: true
      })])
      .then(([user, patientData]) => {
        if (!user) throw new Error('Cannot find the user!')
        const userProfile = user.toJSON()
        const patients = patientData.map((item, index) => ({
          ...item,
          itemN: index + 1
        }))
        return res.render('admin/create-record', { userProfile, patients })
      })
      .catch(err => next(err))
  },
  postRecord: (req, res, next) => {
    const { patientId, medicalRecord } = req.body
    return User.findByPk(patientId)
      .then(user => {
        if (!user) throw new Error('Cannot find the user!')
        return Record.create({
          medicalRecord,
          userId: patientId
        })
      })
      .then(() => {
        req.flash('success_messages', 'Add record success!')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  },
  getAllRecord: (req, res, next) => {
    const userId = req.params.userId
    const defaultLimit = 2
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || defaultLimit
    const offset = getOffset(limit, page)

    return Promise.all([
      User.findByPk(userId),
      Record.findAndCountAll({
        where: {
          userId
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        raw: true
      })
    ])
      .then(([user, record]) => {
        const userProfile = user.toJSON()
        const records = record.rows
        const tab = { userId }
        res.render('admin/all-records', {
          userProfile,
          records,
          pagination: getPagination(limit, page, record.count),
          tab,
          noContent: !records.length
        })
      })
      .catch(err => next(err))
  }
}

module.exports = recordController
