const express = require("express")
const loadHTML = require('./utilities.js').loadHtml

const router = express.Router()

router.get("/login", (req, res) => {
  res.status(200).end(loadHTML("template", "loginform", "placeholder"))
})

router.get("/signup", (req, res) => {
  res.status(200).end(loadHTML("template", "signupform", "placeholder"))

})


module.exports = router