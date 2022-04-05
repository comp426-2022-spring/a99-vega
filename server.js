const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const databases = require('./database.js')

const args = require('minimist')(process.argv)

const port = args["port"] || 5000

const app = express()

const writeStream = fs.createWriteStream('./databases/access.log', {flags: 'a'})
app.use(morgan("combined", {stream: writeStream}))

app.get("/", (req, res) => {
  let html = fs.readFileSync("./www/template.html", {encoding:"utf-8", flags:'r'})
  // console.log(html)
  let test = fs.readFileSync("./www/test.html", {encoding:"utf-8", flags:'r'})
  // console.log(test)
  html = html.replace("<!--MAIN BODY PLACEHOLDER-->", test)
  // html.replace("<!--MAIN BODY PLACEHOLDER-->", "<p>This seems to be working</p>")
  res.end(html)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})