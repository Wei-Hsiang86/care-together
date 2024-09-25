const { User } = require('../models')

const searchController = {
  searchFriend: (req, res, next) => {
    const keyword = req.query.userName.trim()
    if (!keyword) throw new Error('請輸入欲查詢者姓名')

    const friendList = req.user.Friends.map(id => id.fid)

    User.findAll({
      where: {
        name: keyword
      },
      raw: true
    })
      .then(searchedUser => {
        if (!searchedUser.length) throw new Error('查無此人')
        const isFriend = friendList.includes(searchedUser[0].id)

        return res.render('search', { searchedUser, keyword, isFriend })
      })

      .catch(err => next(err))
  }
}
module.exports = searchController
