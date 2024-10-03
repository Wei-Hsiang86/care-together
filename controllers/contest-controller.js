const { User, Patient } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
// const { Op } = require('sequelize')

const contestController = {
  getContests: (req, res, next) => {
    // 這裡先依據 User id 的順序來排列好友
    const friendList = req.user.Friends.map(id => id.fid).sort((a, b) => a - b)

    // 首先查詢有無好友
    return User.scope({ method: ['findFriendInfo', friendList] }).findAll()
      .then(friendInfo => {
        if (Array.isArray(friendInfo) && friendInfo.length === 0) {
          return res.render('contests', { noFriend: true })
        }

        // 有朋友才會進行的動作：
        // 找出每位朋友時間最近的前 n 筆資料
        const dataLimit = 5

        // 準備好查詢動作給 Promise.all
        const contestDataPromises = friendList.map(uid => Patient.scope({ method: ['contestData', uid] }).findAll({
          include: {
            model: User,
            attributes: ['id', 'name']
          },
          limit: dataLimit
        }))

        // 將朋友資料傳遞下去，並且找尋每位好友時間最近的前幾筆資料
        return Promise.all([Promise.resolve(friendInfo), ...contestDataPromises])
          .then(([friendInfo, ...rawContestData]) => {
            const combineContestData = rawContestData.flat()
            const dataLen = combineContestData.length

            // 分頁用
            const defaultLimit = 10
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || defaultLimit
            const offset = getOffset(limit, page)

            const targetData = combineContestData.slice(offset, (offset + limit))
            const friendData = targetData.map((item, index) => ({
              ...item,
              itemN: index + offset + 1
            }))
            return res.render('contests', {
              friendInfo,
              friendData,
              pagination: getPagination(limit, page, dataLen)
            })
          })
      })
      .catch(err => next(err))
  },
  searchContest: (req, res, next) => {
    const keyword = req.query.contestFilter.trim()
    const defaultLimit = Number(req.query.searchNum) || 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || defaultLimit
    const offset = getOffset(limit, page)
    const friendList = req.user.Friends.map(id => id.fid).sort((a, b) => a - b)
    if (!keyword) throw new Error('請輸入欲查詢者姓名')
    if (keyword === req.user.name) throw new Error('請查詢自己以外的使用者')

    console.log(req.query)
    return User.findOne({
      where: {
        name: keyword
      },
      raw: true
    })
      .then(searchedUser => {
        if (!searchedUser) throw new Error('查無此人')
        if (!friendList.includes(searchedUser.id)) throw new Error('與此人並非好友')

        return Promise.all([
          User.scope({ method: ['findFriendInfo', friendList] }).findAll(),
          Patient.scope({ method: ['contestData', searchedUser.id] }).findAndCountAll({
            include: {
              model: User,
              attributes: ['id', 'name']
            },
            limit,
            offset
          })
        ])
      })
      .then(([friendInfo, rawPatientData]) => {
        const friendData = rawPatientData.rows.map((item, index) => ({
          ...item,
          itemN: index + offset + 1
        }))
        return res.render('search-contest', {
          friendInfo,
          friendData,
          keyword,
          pagination: getPagination(limit, page, rawPatientData.count)
        })
      })
      .catch(err => next(err))
  }
}

module.exports = contestController
