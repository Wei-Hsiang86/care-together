const { User } = require('../models')

const searchController = {
  searchFriend: (req, res, next) => {
    const keyword = req.query.userName.trim()
    if (!keyword) throw new Error('請輸入欲查詢者姓名')

    User.findAll({
      where: {
        name: keyword
      },
      raw: true
    })
      .then(searchedUser => {
        if (!searchedUser.length) throw new Error('查無此人')
        // console.log(searchedUser)
        res.render('search', { searchedUser, keyword })
      })

      .catch(err => next(err))
  }
}
module.exports = searchController
