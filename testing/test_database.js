const databases = require("../database.js")
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const Reset = "\x1b[0m"

const test_config = {
  tables: [
    {
      name: "userinfo",
      data: {
        username: "test123",
        password: "testpass123",
        email: "fakeemail@fakedomain.fake",
        picture: "somewhere in the file system",
        status: "test"
      },
    },
    {
      name: "sumbmission",
      data: {
        userid: 1,
        date: "right now",
        address: "742 Evergreen Ter",
        city: "Springfield",
        state: "??",
        zip: 90210,
        latitude: 23.1,
        longitude: 87.5,
        score: 5
      }
    }
  ]
}

function test_userinfo(db) {
  const userinfoData = test_config.tables[0]
  let search = db.prepare("SELECT * FROM userinfo WHERE username = ?")
  let row = search.get(userinfoData.data.username)
  if (!row) {
    let data = userinfoData.data
    const stmt = db.prepare("INSERT INTO userinfo (username, password, email, picture, status) VALUES (?, ?, ?, ?, ?)")
    stmt.run(data.username, data.password, data.email, data.picture, data.status)
    row = search.get(userinfoData.data.username)
  }
  if (row) {
    console.log(`${FgGreen}%s${Reset}`,"Passed userinfo test")
    console.log(row)
  } else {
    console.log(`${FgRed}%s${Reset}`,"userinfo Test failed")
    console.log("Returned:")
    console.log(row)
  }
  
}

function test_sumbission(db) {
  const subInfo = test_config.tables[1]
  let search = db.prepare("SELECT * FROM submission WHERE userid = ? AND date = ?")
  let row = search.get(subInfo.data.userid, subInfo.data.date)
  if (!row) {
    let data = subInfo.data
    const stmt = db.prepare("INSERT INTO submission (userid, date, address, city, state, zip, latitude, longitude, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    stmt.run(data.userid, data.date, data.address, data.city, data.state, data.zip, data.latitude, data.longitude, data.score)
    row = search.get(subInfo.data.userid, subInfo.data.date)
  }
  if (row) {
    console.log(`${FgGreen}%s${Reset}`,"Passed submission table test")
    console.log(row)
  } else {
    console.log(`${FgRed}%s${Reset}`,"submission table Test failed")
    console.log("Returned:")
    console.log(row)
  }
  
}


test_userinfo(databases[0])
test_sumbission(databases[0])