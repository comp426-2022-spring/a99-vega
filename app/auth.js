const express = require("express")
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const { append } = require("express/lib/response");
const { loadContent } = require("./utilities.js");
const db = require("./database.js")[0];
// var db = require(databases.js)

const loadHTML = require('./utilities.js').loadHtml

const router = express.Router()

router.get("/login", (req, res) => {
  console.log(req.session)
  let content = loadHTML("template", "loginform", "placeholder")
  if (req.session.messages){
    const messages = req.session.messages
    // console.log(messages)
    content = loadContent(content, `<p class="error">${messages[messages.length - 1]}<p>`, "message")
    // console.log(content)
    // content = loadContent(content, messages[messages.length - 1], "message")
  }
  res.status(200).end(content)
})

router.get("/signup", (req, res) => {
  res.status(200).end(loadHTML("template", "signupform", "placeholder"))
})


passport.use(new LocalStrategy(function verify(username, password, cb) {
  const stmt = db.prepare('SELECT * FROM userinfo WHERE username = ?')
  const row = stmt.get(username)
  if (row){

    // db.get('SELECT * FROM userinfo WHERE username = ?', [ username ], function(err, row) {
      //   if (err) { return cb(err); }
      //   if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
      
    crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      // console.log("success")
      return cb(null, row);
      //   });
      });
    } else {
      // console.log("fail")
      return cb(null, false, { message: 'Incorrect username or password.' })
    }
}));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/session',
  failureRedirect: '/login', failureMessage: true
}));

router.get('/logout', function(req, res, next) {
  console.log(req.session.passport)
  req.logout();
  res.redirect('/');
});


router.post('/signup', function(req, res, next) {
  // console.log(req.body)
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    const stmt = db.prepare('INSERT INTO userinfo (username, hashed_password, salt, role, status) VALUES (?, ?, ?, ?, ?)')
    stmt.run(req.body.username, hashedPassword, salt, "member", "active")
  });
  res.redirect("/login")
});

module.exports = router