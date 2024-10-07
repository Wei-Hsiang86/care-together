const { User } = require('../models')

const recordController = {
  createRecord: (req, res, next) => {
    res.render('admin/create-record')
  }
}

module.exports = recordController
