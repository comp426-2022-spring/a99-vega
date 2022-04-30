const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
var passport = require('passport');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

const db = require('./app/database.js')[0]
const utilities = require('./app/utilities.js')
const authRouter = require('./app/auth.js');
// const req = require('express/lib/request');
const { Session } = require('express-session');

const loadHTML = utilities.loadHtml
const loadContent = utilities.loadContent
const loadFileAsText = utilities.loadFileAsText

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
  // res.status(200).end(loadHTML("template", "test", "placeholder"))
  res.status(200).end(loadContent(loadFileAsText("www/template.html"), table, "placeholder"))
})

app.get("/profile", (req, res) => {
  if (args["test"]) {console.log(req.session)}

})

app.use(authRouter)

app.get("/session", (req, res) => {
  if (args["test"]) {console.log(req.session)}
  try {
    if (req.session.passport.user.username.length > 0){
      stmt = db.prepare("SELECT * FROM userinfo WHERE username=?")
      user = stmt.get(req.session.passport.user.username)
      // console.log(req.session.passport)
      if (args["test"]) {console.log(user)}
      // req.user = user.__pkid
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
    // req.session = new Session()
    res.redirect("/login")
  }
})

app.post("/submitdata", (req, res)=>{
  if (args["test"]){console.log(req.submitdata)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  try {
    res.end(loadHTML("template", "session/submitdata", "placeholder").replace("%USERID%", vals.userid))
  } catch(e) {
    res.redirect("login")
  }
})

app.post("/profile", (req, res)=>{
  if (args["test"]){console.log(req.submitdata)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  try {
    res.end(loadHTML("template", "session/profile", "placeholder").replace("%USERID%", vals.userid))
  } catch(e) {
    res.redirect("login")
  }
})

app.post("/editprofile", (req, res)=>{
  if (args["test"]){console.log(req.session)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  _pkid = vals.userid

  _username = vals.new_username
  if (_username !== "") { 
    stmt = db.prepare("UPDATE userinfo SET username = ? WHERE __pkid = ?;")
    stmt.run(_username, _pkid)
  }

  /* NOT ABLE TO HASH HERE...
  _password = vals.new_password
  if (_password !== null) { 
    stmt = db.prepare("UPDATE userinfo SET password = ? WHERE __pkid = ?;")
    stmt.run(_password, _pkid)
  }
  */

  _email = vals.new_email
  if (_email !== "") { 
    stmt = db.prepare("UPDATE userinfo SET email = ? WHERE __pkid = ?;")
    stmt.run(_email, _pkid)
  }

  _status = vals.new_status
  if (_status !== "") { 
    stmt = db.prepare("UPDATE userinfo SET status = ? WHERE __pkid = ?;")
    stmt.run(_status, _pkid)
  }
  
  res.redirect("/");
})

app.post("/submit", (req, res)=>{
  if (args["test"]){console.log(req.session)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  stmt = db.prepare("INSERT INTO submission (userid, date, zip, overall_score, mask_score, supplies_score, distancing_score) VALUES (?, ?, ?, ?, ?, ?, ?);")
  stmt.run(vals.userid, vals.zip, vals.date, vals.overall_score, vals.mask_score, vals.supplies_score, vals.distancing_score)
  
  res.redirect("/");
})

app.post("/adminsubmit", (req, res)=>{
  if (args["test"]){console.log(req.session)}
  if (args["test"]){console.log(req.body)}
  vals = req.body
  stmt = db.prepare("UPDATE userinfo SET status = ? WHERE username == ?;")
  stmt.run(vals.status, vals.username)
  
  res.redirect("/");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})