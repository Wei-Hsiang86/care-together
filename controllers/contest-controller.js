const { User, Patient } = require('../models')
const { Op } = require('sequelize')

const contestController = {
  getContests: (req, res, next) => {
    const friendList = req.user.Friends.map(id => id.fid)
    const listLen = friendList.length
    const result = Array.from({ length: listLen }, (_, i) => `x${i}`)
    const constestDatas = friendList.map(uid => Patient.scope({ method: ['contestData', uid] }).findAll())
    let friendData = []
    return Promise.all(constestDatas)
      .then((result) => {
        friendData = concat(result)

        return User.scope({ method: ['findFriendInfo', friendList] }).findAll()
      })
      .then(friendInfo => {
        if (Array.isArray(friendInfo) && friendInfo.length === 0) {
          const noFriend = true
          return res.render('contests', { noFriend })
        }
        return res.render('contests', { friendData })
      })
      .catch(err => next(err))
  }
}

module.exports = contestController
