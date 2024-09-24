const { User, Acquaintance } = require('../models')
const { Op } = require('sequelize')

const friendController = {
  getFriends: (req, res, next) => {
    // 給 /partials/friend-cards 的資料
    const userProfile = { id: req.user.id }
    res.render('friends', { userProfile })
  },
  addFriend: (req, res, next) => {
    const { friendId } = req.params
    // console.log(friendId)
    return Promise.all([
      User.findByPk(friendId),
      Acquaintance.findOne({
        where: {
          situation: 'pending',
          accepterId: req.user.id,
          applierId: friendId
        }
      }),
      Acquaintance.findOne({
        where: {
          situation: 'pending',
          accepterId: friendId,
          applierId: req.user.id
        }
      }),
      Acquaintance.findOne({
        where: {
          situation: 'approved',
          [Op.or]: [
            { [Op.and]: [{ accepterId: req.user.id }, { applierId: friendId }] },
            { [Op.and]: [{ accepterId: friendId }, { applierId: req.user.id }] }
          ]
        }
      })
    ])
      .then(([user, accept, apply, friend]) => {
        if (!user) throw new Error('找不到此使用者')
        if (accept) throw new Error('請確認是否將對方加為好友')
        if (apply) throw new Error('已申請過好友')
        if (friend) throw new Error('已經是好友')

        return Acquaintance.create({
          accepterId: friendId,
          applierId: req.user.id
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  deleteFriend: (req, res, next) => {
    console.log()
  }
}

module.exports = friendController
