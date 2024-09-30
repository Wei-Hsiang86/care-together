const { User, Patient } = require('../models')
// const { Op } = require('sequelize')

const contestController = {
  getContests: (req, res, next) => {
    const friendList = req.user.Friends.map(id => id.fid).sort((a, b) => a - b)
    const listLen = friendList.length
    const dataLimit = 5 // 找出每位朋友時間最近的前 n 筆資料
    const contestData = friendList.map(uid => Patient.scope({ method: ['contestData', uid] }).findAll({
      include: {
        model: User,
        attributes: ['id', 'name']
      },
      limit: dataLimit
    }))

    // 先去查詢有無好友
    return User.scope({ method: ['findFriendInfo', friendList] }).findAll()
      .then(friendInfo => {
        if (Array.isArray(friendInfo) && friendInfo.length === 0) {
          const noFriend = true
          return res.render('contests', { noFriend })
        }

        // 接著再去找每位好友時間最近的前幾筆資料
        return Promise.all(contestData)
          .then((result = Array.from({ length: listLen }, (_, i) => `x${i}`)) => {
            const friendData = result.flat().map((item, index) => ({
              ...item,
              itemN: index + 1
            }))
            return res.render('contests', { friendData })
          })
      })
      .catch(err => next(err))
  }
}

module.exports = contestController
