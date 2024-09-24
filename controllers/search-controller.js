const { User } = require('../models')

const searchController = {
  searchFriend: (req, res, next) => {
    const keyword = req.query.userName.trim()
    if (!keyword) throw new Error('請輸入欲查詢者姓名')

    // 還要把這個人是不是跟 user 已經是朋友關係，傳給 handlebars
    // 在 passport 有寫，晚點做完可以看看會怎麼實現
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
