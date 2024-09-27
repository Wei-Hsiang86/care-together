const { User } = require('../models')

const searchController = {
  searchFriend: (req, res, next) => {
    const keyword = req.query.userName.trim()
    if (!keyword) throw new Error('請輸入欲查詢者姓名')
    if (keyword === req.user.name) throw new Error('請查詢自己以外的使用者')

    const friendList = req.user.Friends.map(id => id.fid)
    const applyList = req.user.Applyings.map(id => id.id)
    const thinkList = req.user.Thinkings.map(id => id.id)

    User.findAll({
      where: {
        name: keyword
      },
      raw: true
    })
      .then(searchedUser => {
        if (!searchedUser.length) throw new Error('查無此人')
        const isFriend = friendList.includes(searchedUser[0].id)
        const applying = applyList.includes(searchedUser[0].id)
        const thinking = thinkList.includes(searchedUser[0].id)

        return res.render('search', { searchedUser, keyword, isFriend, applying, thinking })
      })

      .catch(err => next(err))
  }
}
module.exports = searchController
