const express = require("express").Router

const router = express()

router.post("/create-room", (req, res) => {
  res.redirect("/room/" + Math.random().toString(36).substring(7))
})

router.get("/:hash", (req, res) => {
  res.render("video", {room: req.params.hash})
})

module.exports = router