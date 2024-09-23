// const { Patient, User } = require('../models')

const friendController = {
  getFriends: (req, res, next) => {
    const name = req.user.name
    res.render('friends', { name })
  }
}

module.exports = friendController
