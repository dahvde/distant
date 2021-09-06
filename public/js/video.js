const socket = io()
const video = document.getElementById("video-player")
const room = document.getElementById("room-code").innerHTML
let time_change

video.addEventListener("timeupdate", (e) => {
  // console.log(e.target.currentTime)
  socket.emit("video-timestamp")
})

video.addEventListener("play", (e) => {
  socket.emit("video-options", {paused: false, room})
})

video.addEventListener("pause", (e) => {
  socket.emit("video-options", {paused: true, room})
})

document.querySelector(".controls .play").addEventListener("click", (e) => {
  const elem = e.target.classList
  if (video.paused) {
    video.play()
    elem.remove("fa-play")
    elem.add("fa-pause")
  } else {
    video.pause()
    elem.remove("fa-pause")
    elem.add("fa-play")
  }
})

function switchClass(action, target) {
  const elem = target.classList
  switch (video.paused) {
    case false:
      console.log("play")
      elem.remove("fa-pause")
      elem.add("fa-play")
    case true:
      console.log("pause")
      elem.remove("fa-play")
      elem.add("fa-pause")
  }
}

socket.on("get-time", (e) => {
  console.log(e)
  socket.emit("send-time", {time: video.currentTime, targetClient: e})
})

socket.on("send-time", (e) => {
  video.currentTime = e
  console.log(e)
})

socket.on("connect", function (e) {
  socket.emit("room-code", room)
})

socket.on("video-options", (e) => {
  console.log(e)
  if (e.paused) {
    video.pause()
  } else {
    video.play()
  }
})

socket.on("message", (e) => {
  console.log(e)
})

// socket.on("client-pause", (e) => {
//   video.
// })