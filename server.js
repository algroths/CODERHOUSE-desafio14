const express = require('express')
const productoRouter = require('./productoRouter')
const chatRouter = require('./chatRouter')
const randomRouter = require('./randomRouter')
const ContenedorMessages = require('./ContenedorMessages')
const session = require('express-session')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const { options } = require('./db/sqlite')
const knex = require('knex')(options)
const storeMessages = new ContenedorMessages(knex, 'messages')
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const User = require('./models/user')
const { createHash, isValidPassword } = require('./utils')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const { json } = require('express')
const dotenv = require('dotenv').config()
const parseArg = require('minimist')


app.use(session({
  secret: process.env.SECRET,
  resave: JSON.parse(process.env.RESAVE),
  saveUninitialized: JSON.parse(process.env.SAVEUNINITIALIZED),
  cookie: {
    expires: +process.env.EXPIRES
  }
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())


app.use('/static', express.static(__dirname + '/public'))

app.use('/productos', productoRouter)
app.use('/chat', chatRouter)
app.use('/api/random', randomRouter)

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/desafio14`)



app.set('view engine', 'ejs')

//PASSPORT

passport.use('login', new LocalStrategy((username, password, done) => {
  return User.findOne({ username })
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'Nombre de usuario incorrecto' })
      }
      if (!isValidPassword(user.password, password)) {
        return done(null, false, { message: 'Contraseña incorrecta' })
      }
      return done(null, user)
    })
    .catch(err => done(err))
}))


passport.use('signup', new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  return User.findOne({ username })
    .then(user => {
      if (user) {
        return done(null, false, { message: 'Nombre de usuario ya esta en uso.' })
      }

      const newUser = new User()
      newUser.username = username
      newUser.password = createHash(password)
      newUser.email = req.body.email

      return newUser.save()
    })
    .then(user => {
      return done(null, user)
    })
    .catch(err => done(err))
}))

passport.serializeUser((user, done) => {
  console.log('serializeUser')
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  console.log('deserializeUser')
  User.findById(id)
    .then(user => {
      done(null, user)
    })
})

//LOGIN/LOGOUT & SIGNUP

app.get('/login', (req, res) => {
  return res.render('login', { message: req.flash('error') })
})

app.get('/signup', (req, res) => {
  return res.render('signup', { message: req.flash('error') })
})

app.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/failLogin',
  failureFlash: true
}))

app.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/failSignup',
  failureFlash: true
}))

app.get('/logout', (req, res) => {
  const data = {
    username: req.user.username
  }
  return req.session.destroy(err => {
    if (!err) {
      return res.render('logout', data)
    }

    return res.json({ error: err })
  })
})

app.get('/failLogin', (req, res) => {
  return res.render('failLogin')
})

app.get('/failSignup', (req, res) => {
  return res.render('failSignup')
})

app.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/login')

}, (req, res) => {
  const data = {
    username: req.user.username
  }
  return res.render('index', data)
})

//INFO

app.get('/info', (req, res) => {

  const data = {
    arg: JSON.stringify(arg),
    os: process.platform,
    vNode: process.version,
    rss: process.memoryUsage().rss,
    path: process.env.PATH,
    id: process.pid,
    dir: process.cwd()
  }

  return res.render('info', data)
})

let opts = { default: { p: '8080' } }
const arg = parseArg(process.argv.slice(2), opts)

const PORT = arg.p

httpServer.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en puerto ${PORT}`)
})

io.on('connection', socket => {
  console.log(`Usuario conectado con ID: ${socket.id}`)

  io.sockets.emit('contentTable')
  io.sockets.emit('contentMessage')

  socket.on('inputMessage', data => {

    const now = new Date()
    const time = `${now.getHours()}: ${(now.getMinutes() < 10 ? '0' : '') + now.getMinutes()}: ${now.getSeconds()}`
    const date = `${now.getUTCDate()} / ${now.getUTCMonth()} / ${now.getUTCFullYear()}`

    const message = {
      email: data.email,
      text: data.text,
      created_at: `${date} ${time}`
    }

    io.sockets.emit('message', message)
    storeMessages.save(message)
  })
})




