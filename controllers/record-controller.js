const { User, Patient } = require('../models')

const recordController = {
  createRecord: (req, res, next) => {
    const userId = req.params.userId
    return Promise.all([
      User.findByPk(userId),
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
        const patients = patientData.map((item, index) => ({
          ...item,
          itemN: index + 1
        }))
        return res.render('admin/create-record', { user, patients })
      })
      .catch(err => next(err))
  }
}

module.exports = recordController
