const express = require("express")
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const db = require("./database.js");
// var db = require(databases.js)

const loadHTML = require('./utilities.js').loadHtml

const router = express.Router()

router.get("/login", (req, res) => {
  res.status(200).end(loadHTML("template", "loginform", "placeholder"))
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
      if (!crypto.timingSafeEqual(row.password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, row);
      //   });
      });
    } else {
      return cb(null, falsee, { message: 'Incorrect username or password.' })
    }
}));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router