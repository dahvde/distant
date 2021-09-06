const express = require("express")
const pug = require("pug")

const app = express()

app.engine("pug", pug.__express)
app.set("view engine", "pug")

app.use(express.static("public"))

const streamRoute = require("./routes/stream")
const roomRoute = require("./routes/room")

app.use("/", streamRoute)
app.use("/room", roomRoute)

module.exports = app