const { User, Acquaintance, Friendship } = require('../models')
// const { Op } = require('sequelize')

const friendController = {
  getFriends: (req, res, next) => {
    // 給 /partials/friend-cards 的資料
    const userProfile = { id: req.user.id }
    const friendList = req.user.Friends.map(id => id.fid)
    const applyList = req.user.Applyings.map(id => { return { id: id.id, name: id.name, photo: id.photo } })
    const thinkList = req.user.Thinkings.map(id => { return { id: id.id, name: id.name, photo: id.photo } })

    User.scope({ method: ['findFriendInfo', friendList] }).findAll()
      .then(friendInfo => {
        return res.render('friends', { userProfile, friendInfo, applyList, thinkList })
      })
      .catch(err => next(err))
  },
  addFriend: (req, res, next) => {
    const { friendId } = req.params
    // console.log(friendId)
    return Promise.all([
      User.findByPk(friendId),
      Acquaintance.scope({ method: ['findThinkF', friendId, req.user.id] }).findOne(),
      Acquaintance.scope({ method: ['findApplyF', friendId, req.user.id] }).findOne(),
      Friendship.scope({ method: ['findMyF', friendId, req.user.id] }).findOne()
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
      User.findByPk(friendId),
      Acquaintance.scope({ method: ['findApproveAp', friendId, req.user.id] }).findOne(),
      Acquaintance.scope({ method: ['findApproveAc', friendId, req.user.id] }).findOne(),
      Friendship.scope({ method: ['findMyF', friendId, req.user.id] }).findOne(),
      Friendship.scope({ method: ['listWithMe', friendId, req.user.id] }).findOne()
    ])
      .then(([user, approveAp, approveAc, myFriend, withMe]) => {
        if (!user) throw new Error('找不到此使用者')
        if (!myFriend) throw new Error('你們並非好友')

        return Promise.all([
          approveAp === null ? approveAc.destroy() : approveAp.destroy(),
          myFriend.destroy(),
          withMe.destroy()
        ])
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  cancelFriend: (req, res, next) => {
    const { friendId } = req.params
    return Promise.all([
      User.findByPk(friendId),
      Acquaintance.scope({ method: ['findApplyF', friendId, req.user.id] }).findOne()
    ])
      .then(([user, applyData]) => {
        if (!user) throw new Error('找不到此使用者')
        // console.log(applyData.toJSON())
        return applyData.destroy()
      })
      .then(() => {
        req.flash('success_messages', '已經取消好友邀請')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  refuseFriend: (req, res, next) => {
    const { friendId } = req.params
    return Promise.all([
      User.findByPk(friendId),
      Acquaintance.scope({ method: ['findThinkF', friendId, req.user.id] }).findOne()
    ])
      .then(([user, inviteData]) => {
        if (!user) throw new Error('找不到此使用者')
        return inviteData.destroy()
      })
      .then(() => {
        req.flash('success_messages', '已經拒絕好友邀請')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  approveFriend: (req, res, next) => {
    const { friendId } = req.params
    return Promise.all([
      User.findByPk(friendId),
      Acquaintance.scope({ method: ['findThinkF', friendId, req.user.id] }).findOne()
    ])
      .then(([user, inviteData]) => {
        if (!user) throw new Error('找不到此使用者')

        return Promise.all([
          inviteData.update({
            situation: 'approved'
          }),
          Friendship.bulkCreate([
            { uid: friendId, fid: req.user.id },
            { uid: req.user.id, fid: friendId }
          ])])
      })
      .then(() => {
        req.flash('success_messages', '已成為好友')
        return res.redirect('back')
      })
      .catch(err => next(err))
  }
}
module.exports = friendController
