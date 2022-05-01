const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const { Session } = require('express-session');

var passport = require('passport');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

// Helper modules
const db = require('./app/database.js')[0]
const utilities = require('./app/utilities.js')
const authRouter = require('./app/auth.js');

// Helper functions
const loadHTML = utilities.loadHtml
const loadContent = utilities.loadContent
const loadFileAsText = utilities.loadFileAsText

// Command line arguments
const args = require('minimist')(process.argv)
const port = args["port"] || 5000

const dataPath = 'data'

const app = express()

// Passport serializer
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

// Passport deserializer
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const writeStream = fs.createWriteStream(`./${dataPath}/access.log`, {flags: 'a'})
app.use(morgan("combined", {stream: writeStream}))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './data/temp' })
}));

app.use(passport.authenticate('session'));
app.use(express.static('/session'));

// Serve files in css
app.use(express.static("./www/css"))

// API that fetches the entire database and returns it as a json object
app.get("/data", (req, res) => { 
  let data = db.prepare("SELECT * FROM submission").all()
  res.json(data)
})

app.get("/", (req, res)=>{
  res.redirect("/app")
})

// Endpoint for the main page - this is a test page right now
app.get("/app", (req, res) => {
  let data = db.prepare("SELECT * FROM submission").all()
  if (args["test"]) {console.log(data)}
  let table = `
  <table>
    <tr>
      <th>Date</th>
      <th>ZIP</th>
      <th>Overall Score</th>
      <th>Mask Score</th>
      <th>Supplies Score</th>
      <th>Distancing Score</th>
    </tr>
  `

  for (row of data){
    table += `
    <tr>
      <td>${row.zip}</td>
      <td>${row.date}</td>
      <td style="text-align:center">${row.overall_score}</td>
      <td style="text-align:center">${row.mask_score}</td>
      <td style="text-align:center">${row.supplies_score}</td>
      <td style="text-align:center">${row.distancing_score}</td>
    </tr>`
  }
  table +=`</table>`
  res.status(200).end(loadContent(loadFileAsText("www/template.html"), table, "placeholder"))
})

// Router for all user authentication
app.use(authRouter)

// Endpoint that validates user's cookies and displays the appropriate page
app.get("/session", (req, res) => {
  if (args["test"]) {console.log(req.session)}
  try {
    if (req.session.passport.user.username.length) {
      stmt = db.prepare("SELECT * FROM userinfo WHERE username=?")
      user = stmt.get(req.session.passport.user.username)
      if (args["test"]) {console.log(user)}
      if (user.role == "member"){
        let replace = loadHTML("template", "session/fork", "placeholder").replace("%USERID%", user.__pkid.toString())
        res.end(replace.replace("%USERID%", user.__pkid.toString()))
      } else if (user.role =="admin"){
        res.end(loadHTML("template", "session/admin", "placeholder"))
      } else {
        res.redirect("/login")
      }
    } else {
      if (args["test"]){console.log(req.session.passport)}
      res.redirect("/login")}
  } catch (e) {
    res.redirect("/login")
  }
})

// Add to the database
app.post("/submitdata", (req, res)=>{
  if (args["test"]){console.log(req.submitdata)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  try {
    // Does the user have an activesession?
    if (req.session.passport.user.username.length) {
      res.end(loadHTML("template", "session/submitdata", "placeholder").replace("%USERID%", vals.userid))
    }
  } catch(e) {
    res.redirect("/login")
  }
})

//Update the user's profile setting
app.post("/profile", (req, res)=>{
  if (args["test"]){console.log(req.submitdata)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  try {
    res.end(loadHTML("template", "session/profile", "placeholder").replace("%USERID%", vals.userid))
  } catch(e) {
    res.redirect("/login")
  }
})

// Changes the user's info in database
app.post("/editprofile", (req, res)=>{
  if (args["test"]){console.log(req.session)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  _pkid = vals.userid
  _username = vals.new_username

  if (_username !== "") { 
    stmt = db.prepare("UPDATE userinfo SET username = ? WHERE __pkid == ?;")
    stmt.run(_username, _pkid)
  }

  _email = vals.new_email
  if (_email !== "") { 
    stmt = db.prepare("UPDATE userinfo SET email = ? WHERE __pkid == ?;")
    stmt.run(_email, _pkid)
  }

  _status = vals.new_status
  if (_status !== "") { 
    stmt = db.prepare("UPDATE userinfo SET status = ? WHERE __pkid == ?;")
    stmt.run(_status, _pkid)
  }
  
  res.redirect("/");
})

// Enters submissions into the database
app.post("/submit", (req, res)=>{
  if (args["test"]){console.log(req.session)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  try {
    if (req.session.passport.user.username.length) {
      stmt = db.prepare("INSERT INTO submission (userid, date, zip, overall_score, mask_score, supplies_score, distancing_score) VALUES (?, ?, ?, ?, ?, ?, ?);")
      stmt.run(vals.userid, vals.zip, vals.date, vals.overall_score, vals.mask_score, vals.supplies_score, vals.distancing_score)
      res.redirect("/");
    }
  } catch(e) {
    res.redirect("/login")
  }
})

// Allows administrators to edit the other user access
app.post("/adminsubmit", (req, res)=>{
  if (args["test"]){console.log(req.session)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  stmt = db.prepare("SELECT * FROM userinfo WHERE username=?")
  user = stmt.get(req.session.passport.user.username)
  try{ 
    if (user.role=="admin") {
      stmt = db.prepare("SELECT * FROM userinfo WHERE username=?")
      user = stmt.get(vals.username)
      if(!vals.username) {throw error(e)}
      stmt = db.prepare("UPDATE userinfo SET status = ?, role = ? WHERE username == ?;")
      stmt.run(vals.status, vals.role, vals.username)
      res.redirect('/admin/success')
    } else {res.redirect('/login')}
  } catch(e) {
    res.redirect('/admin/error')
  }
})

// Administrators successfully changed user priviledge
app.get("/admin/success", (req, res)=>{
  if (args["test"]){console.log(req.session)}
  if (args["test"]){console.log(req.body)}

  if (req.session.passport.user.username.length) {
    stmt = db.prepare("SELECT * FROM userinfo WHERE username=?")
    user = stmt.get(req.session.passport.user.username)
    try { 
      if (user.role=="admin") {
        res.status(200).end(loadContent(loadHTML("template", "session/admin", "placeholder"), "<p id=adminsuccess>Success!</p>", "adminplaceholder"))
    } else {
      res.redirect('/login')
    }
    } catch(e) {
    res.redirect('/')
  }
  }
})

// Something went wrong when administrator tried to update a user's info
app.get("/admin/error", (req, res)=>{
  if (args["test"]){console.log(req.session)}
  if (args["test"]){console.log(req.body)}

  if (req.session.passport.user.username.length) {
    stmt = db.prepare("SELECT * FROM userinfo WHERE username=?")
    user = stmt.get(req.session.passport.user.username)
    try { 
      if (user.role=="admin") {
        res.status(200).end(loadContent(loadHTML("template", "session/admin", "placeholder"), "<p id=adminerror>Error</p>", "adminplaceholder"))
    } else {
      res.redirect('/login')
    }
    } catch(e) {
    res.redirect('/')
  }
  }
})

// Run the app
app.listen(port, () => {
  console.log(`Example app listening on port ${port}.`)
})