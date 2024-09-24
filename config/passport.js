const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// 設置 passport 使用種類
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return cb(null, user)
        })
      })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      // 申請好友等待中
      { model: User, as: 'Applyings' },
      // 被申請好友邀請思考中
      { model: User, as: 'Thinkings' },
      // 已經成為好友
      { model: User, as: 'FriendsA' },
      { model: User, as: 'FriendsB' }
    ]
  })
    .then(user => {
      user = user.toJSON()
      // console.log(user)
      return cb(null, user)
    })
    .catch(err => {
      console.error('Error:', err)
      return cb(err)
    })
})
module.exports = passport
