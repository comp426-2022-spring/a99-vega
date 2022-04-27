const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
var passport = require('passport');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

const databases = require('./app/database.js')
const utilities = require('./app/utilities.js')
const authRouter = require('./app/auth.js');
const req = require('express/lib/request');
const { Session } = require('express-session');

const loadHTML = utilities.loadHtml
const loadContent = utilities.loadContent

const args = require('minimist')(process.argv)


const dataPath = 'data'
const port = args["port"] || 5000


const app = express()

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const writeStream = fs.createWriteStream(`./${dataPath}/access.log`, {flags: 'a'})
app.use(morgan("combined", {stream: writeStream}))

app.use(express.static('/session'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './data/temp' })
}));

app.use(passport.authenticate('session'));


app.use(express.static("./www/css"))


// Endpoint for the main page - this is a test page right now
app.get("/", (req, res) => {
  res.status(200).end(loadHTML("template", "test", "placeholder"))
})

app.use(authRouter)

app.get("/session", (req, res) => {
  console.log(req.session)
  try {
  if (req.session.passport.user.username.length > 0){
    console.log(req.session.passport)
    res.end(loadHTML("template", "session/submitdata", "placeholder"))
  } else {
    console.log(req.session.passport)
    res.redirect("/login")}
  } catch (e) {
    // req.session = new Session()
    res.redirect("login")
  }
})
// // Endpoint for the login page:
// app.get("/login", (req, res) => {
//   res.status(200).end(loadHTML("template", "loginform", "placeholder"))
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})