const Database = require("better-sqlite3")
const table = require("better-sqlite3/lib/methods/table")



function setup(db, tablename, tablecolumns){
  const stmt = db.prepare("SELECT name FROM sqlite_schema WHERE type='table' and name=?")
  const table = stmt.get(tablename)

  if (!table) {
    let columns = ""
    let count = 0
    for (let item in tablecolumns) {
      if (count++ > 0) {
        columns += ",\n"
      }
      columns += `${item} ${tablecolumns[item]}`
    }
    const dbInit = `CREATE TABLE ${tablename} (${columns});`
    db.exec(dbInit)
  }
}

function testUserinfo(db) {
  let row = db.prepare("SELECT * FROM userinfo WHERE username = 'test'").get()
  if (!row) {
    const stmt = db.prepare("INSERT INTO userinfo (username, password, status) VALUES ('test', 'test', 1)")
    stmt.run()
    row = db.prepare("SELECT * FROM userinfo WHERE username = 'test'").get()
  }
  if (row) {
    console.log(row)
  } else {
    console.log("Test failed")
  }
  
}

const db = new Database("./databases/user_content.db")

const userinfo = {
  "id": "INTEGER PRIMARY KEY",
  "username": "TEXT",
  "password": "TEXT",
  "status": "INTEGER"
}

setup(db, "userinfo", userinfo)
// testUserinfo(db)

// db.prepare("SELECT name FROM sqlite_schema WHERE type='table' AND name='userinfo'")

// if (!db.get()){
//   db.prepare("")
// }


// TODO:
// need to create two tables:
  // 1 tables for user info
    // userinfo database should have:
    // user id (pk)
    // username
    // password (hashed)
    // email ? (for recovery)
    // profile picture (probably a filename?)
    // status
    // anything else?

  // 1 tables for content (observations)
    // content db should have:
    // submission id (pk)
    // user id (fk - from userinfo database)
    // longitude 
    // latitude
    // address (of the place reviewed - should be split --
      // street address, city, state, zip) 
    // (could we get the city/state from the zip code?)
    // date of observation
    // compliance score (maybe split this one too)
      // mask
      // social distancing
      // handwashing/sanitizer use 
      // wiping surfaces 
      // symptomatic crowds (ie, people out while coughing, sneezing...)

// QUESTIONS:
  // Should access log be a text file vs a database?

module.exports = db