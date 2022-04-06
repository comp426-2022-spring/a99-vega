const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const databases = require('./database.js')

const args = require('minimist')(process.argv)


const dataPath = 'data'
const port = args["port"] || 5000


const app = express()

const writeStream = fs.createWriteStream(`./${dataPath}/access.log`, {flags: 'a'})
app.use(morgan("combined", {stream: writeStream}))

/**
 * Use the fs library to load a file as utf-8
 * 
 * @param {String} filename the full or relative path of the file
 * @returns the text of the file read
 */
function loadFileAsText(filename) {
  return fs.readFileSync(filename, {encoding:"utf-8", flags:'r'})
}

/**
 * Load the html file from a template and injects body into a placeholder div
 * Default directory for lookup is "./www"
 * The placeholder div will be replaced
 * Do not include ".html" in filenames
 * 
 * @param {String} template the filename of the template html file (do not include .html in name)
 * @param {String} body     the filename of the body html file (do not include .html in name)
 * @param {*} placeholder   the id of the placeholder div used to replace content
 * @returns 
 */
function loadHTML (template, body, placeholder, directory){
  let path = directory || "./www"
  let html = loadFileAsText(`${path}/${template}.html`)
  let content = loadFileAsText(`${path}/${body}.html`)
  return html.replace(`<div id="${placeholder}"></div>`, content)
}


// Endpoint for the main page - this is a test page right now
app.get("/", (req, res) => {
  res.status(200).end(loadHTML("template", "test", "placeholder"))
})

// Endpoint for the login page:
app.get("/login", (req, res) => {
  res.status(200).end(loadHTML("template", "loginform", "placeholder"))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})