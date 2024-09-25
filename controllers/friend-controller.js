const { User, Acquaintance, Friendship } = require('../models')

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
      Friendship.findOne({
        where: {
          uid: req.user.id,
          fid: friendId
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
    const { friendId } = req.params

    return Promise.all([
      Friendship.findOne({
        where: {
          uid: req.user.id,
          fid: friendId
        }
      }),
      Friendship.findOne({
        where: {
          uid: friendId,
          fid: req.user.id
        }
      }),
      Acquaintance.findOne({
        where: {
          situation: 'approved',
          accepterId: req.user.id,
          applierId: friendId
        }
      }),
      Acquaintance.findOne({
        where: {
          situation: 'approved',
          accepterId: friendId,
          applierId: req.user.id
        }
      })
    ])
      .then(([friend, theOther, acquaintance1, acquaintance2]) => {
        if (!friend) throw new Error('你們並非好友')

        return Promise.all([
          friend.destroy(),
          theOther.destroy(),
          acquaintance1 === null ? acquaintance2.destroy() : acquaintance1.destroy()
        ])
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = friendController
