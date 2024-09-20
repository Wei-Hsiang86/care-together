const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('密碼重複輸入不相同!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('電子郵件已註冊過!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    if (req.user.dataValues.isAdmin) {
      req.flash('success_messages', '後臺登入！')
      res.redirect('/admin/patients')
    } else {
      req.flash('success_messages', '成功登入！')
      res.redirect('/patients')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id
      /*, {
      include: [
        { model: Comment, include: Patient },
        { model: Patient, as: 'blablabla' }
      ]
    } */
    )
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        const userProfile = user.toJSON()
        return res.render('users/profile', { userProfile })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', '只能編輯自己的資料！')
      res.redirect(`/users/${req.user.id}`)
    }

    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name, intro } = req.body
    const { file } = req
    if (!name) throw new Error('姓名為必填欄位')
    if (req.user.id !== Number(req.params.id)) throw new Error('只能更改自己的資料！')

    return Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('使用者不存在!')

        return user.update({
          name,
          photo: filePath || user.photo,
          intro
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
