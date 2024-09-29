const { User, Patient } = require('../models')
const { Op } = require('sequelize')

const contestController = {
  getContests: (req, res, next) => {
    const friendList = req.user.Friends.map(id => id.fid)

    return Promise.all([
      User.scope({ method: ['findFriendInfo', friendList] }).findAll(),
      Patient.findAll({
        where: {
          userId: {
            [Op.in]: friendList
          }
        },
        attributes: ['id', 'temperature', 'heartRate', 'bloodPressure', 'gluac', 'glupc', 'updatedAt'],
        limit: 2,
        order: [['createdAt', 'DESC']],
        raw: true
      })
    ])
      .then(([friendInfo, data]) => {
        if (Array.isArray(friendInfo) && friendInfo.length === 0) {
          const noFriend = true
          return res.render('contests', { noFriend })
        }

        const friendData = data.map(item => ({
          ...item,
          name: friendInfo[0].name,
          email: friendInfo[0].email
        }))
        console.log(friendData)
        return res.render('contests', { friendData })
      })
      .catch(err => next(err))
  }
}

module.exports = contestController
