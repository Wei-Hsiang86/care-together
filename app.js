const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const routes = require('./routes')

const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

// 驗證
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method')) // 自定義的辨識參數

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  // console.log(req.user)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Care together is listening on port ${port}!`)
})
