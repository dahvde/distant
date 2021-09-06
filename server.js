const app = require("./index.js")
const {success, error} = require("consola")
const {PORT} = require("./config.js")
const http = require("http")
const socketio = require("socket.io")

const server = http.createServer(app);
const io = socketio(server)

io.on("connection", (socket) => {
  socket.on("room-code", (e) => {
    socket.join(e)
    const adminId = io.sockets.adapter.rooms.get(e).values().next().value
    if (io.sockets.adapter.rooms.get(e).size > 1) {
      socket.broadcast.to(adminId).emit("get-time", socket.id)
    }
    socket.emit("message", "Joined Room " + e)
  })
  socket.on("video-options", (e) => {
    if (!e.paused) {
      const adminId = io.sockets.adapter.rooms.get(e.room).values().next().value
      if (io.sockets.adapter.rooms.get(e.room).size > 1) {
        socket.broadcast.to(adminId, e.room)
      }
    }
    socket.broadcast.to(e.room).emit("video-options", {paused: e.paused})
  })
  socket.on("send-time", (e) => {
    const {targetClient, time} = e
    socket.broadcast.to(targetClient).emit("send-time", time)
  })
})

server.listen(PORT, () => {
  success({
    message: "Server up on port " + PORT,
    badge: true
  })
})