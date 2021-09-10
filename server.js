const app = require("./index.js")
const {success, error} = require("consola")
const {PORT} = require("./config.js")
const http = require("http")
const socketio = require("socket.io")

const server = http.createServer(app);
const io = socketio(server)

io.on("connection", (socket) => {
  try {
  socket.on("room-code", (e) => {
    const save = socket.join(e)
    socket.emit("message", "Joined Room " + e)
  })
  socket.on("get-time", (e) => {
    const room = io.sockets.adapter.rooms.get(e.room)
    console.log(e)
    console.log(room)
    if (room) {
      const adminId = room.values().next().value
      if (adminId != socket.id) {
        if (room.size > 1) {
          socket.broadcast.to(adminId).emit("get-time", {client_id: socket.id, time: e.time})
        }
      }
    }
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
    console.log(time)
    socket.broadcast.to(targetClient).emit("send-time", time)
  })
 } catch (e) {
   console.log(e)
 }
})

server.listen(PORT, () => {
  success({
    message: "Server up on port " + PORT,
    badge: true
  })
})