const Database = require("better-sqlite3")
const fs = require("fs")
const table = require("better-sqlite3/lib/methods/table")
const args = require("minimist")(process.argv)
const crypto = require('crypto')


//
const databasePath = 'data'
/**
 * Sets searches a database for the specified table and creates it if not present
 * 
 * @param {Databasee} db            The database object in which to search
 * @param {String}    tablename     The name of the requested table
 * @param {Object}    tablecolumns  The columns and types to add if the table needs to be created
 * 
 *  Columns should have the following format:
 *    { <column name>: <field type>, ...}
 *    Example { "__pkid": "INTEGER PRIMARY KEY"}
 */
function setupTable(db, tablename, tablecolumns){
  // search for table with requested name
  const stmt = db.prepare("SELECT name FROM sqlite_schema WHERE type='table' and name=?")
  const table = stmt.get(tablename)

  // if table is not found, set it up:
  if (!table) {
    // set up a string with the table columns that should look like "field: type,\n..."
    let columns = ""
    let count = 0
    for (let item in tablecolumns) {
      if (count++ > 0) {
        columns += ",\n"
      }
      columns += `${item} ${tablecolumns[item]}`
    }

    // run statement to create table with columns added
    const dbInit = `CREATE TABLE ${tablename} (${columns});`
    db.exec(dbInit)
  }
}

/**
 * Creates a specific database requested based on configuration file
 * 
 * @param {Object} database   The database configuration to set up
 * @returns the retrieved or created database object 
 */
function setupDatabase(database) {
  // retrieves the database requested
  const db = new Database(`./${databasePath}/${database["name"]}.db`)

  // write each of the tables to the database
  for (let table of database["tables"]){
    setupTable(db, table["name"], table["columns"])
  }
  return db
}

/**
 * Initialize the requested databases based on the provided config file
 * May create or retrieve multiple databases and place them into array 
 * 
 * @param {String} configFile   The path of the file with the setup info
 * @returns array of created or retrieved databases
 */
function initialize(configFile){
  // get config file and convert to json
  const f = fs.readFileSync(configFile, {encoding: "utf-8", flags:"r"})
  const config = JSON.parse(f)

  // initialize array
  const databases = []

  // build databases in array
  for (let database of config.databases){
    databases.push(setupDatabase(database))
  }

  return databases
}

  const databases = initialize("./config/dbconfig.json")

// FOR TESTING PURPOSES
if (args["test"]){
  const testUser = "test_admin"
  console.log(databases[0].prepare("SELECT * FROM sqlite_schema WHERE type = 'table'").all())
  if(!databases[0].prepare("SELECT * from userinfo WHERE username = ?").get(testUser)){
    const testPass = "notpassword"

    var salt = crypto.randomBytes(16);
    databases[0].prepare('INSERT OR IGNORE INTO userinfo (username, hashed_password, salt, role, status) VALUES (?, ?, ?, ?, ?)').run(
      testUser,
      crypto.pbkdf2Sync(testPass, salt, 310000, 32, 'sha256'),
      salt, "admin", "active"
    );
  }
  // console.log(databases[0].prepare("SELECT * FROM sqlite_schema WHERE type = 'table'").all())
  // console.log(databases[0].prepare("INSERT INTO userinfo "))
  console.log(databases[0].prepare("SELECT * FROM userinfo").all())
}

module.exports = databases