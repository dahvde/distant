const socket = io()
const video = document.getElementById("video-player")
const room = document.getElementById("code").innerHTML
const play = document.querySelector(".controls .play")
const fullscreen = document.querySelector(".controls .fullscreen")
const volume_button = document.querySelector(".volume-button")
const volume_slider = document.querySelector(".volume-slider input[type='range']")
const sync = document.getElementById("sync")
let room_joined = false
let video_volume_store;
video.volume = volume_slider.value
if (video.muted) {
  switchVolume("muted")
} else {
  switchVolume("unmuted")
}
video.onloadeddata = (e) => {
  if (video.paused) {
    switchControl("pause")
  } else {
    switchControl("play")
  }
  var start = Date.now()
  socket.emit("get-time", {room, time: {start, end: null}})
}
video.addEventListener("timeupdate", (e) => {
  // console.log(e.target.currentTime)
  socket.emit("video-timestamp")
})

document.addEventListener("DOMContentLoaded", (e) => {
  document.body.classList.remove("preload")
})

sync.addEventListener("click", (e) => {
  var start = Date.now()
  socket.emit("get-time", {room, time: {start, end: null}})
})

video.addEventListener("play", (e) => {
  if (room_joined) {
    socket.emit("video-options", {paused: false, room})
  }
})

video.addEventListener("pause", (e) => {
  if (room_joined) {
    socket.emit("video-options", {paused: true, room})
  }
})

volume_button.addEventListener("click", (e) => {
  const classList = e.target.classList
  console.log(video.muted)
  if (!video.muted) {
    // video_volume_store = video.volume
    video.muted = true
    // volume_slider.value = 0
    switchVolume("mute")
  } else {
    // video.volume = video_volume_store
    volume_slider.value = video_volume_store
    video.muted = false
    switchVolume("unmute")
  }
})

volume_slider.addEventListener("change", (e) => {
  video.volume = volume_slider.value
})

document.querySelector(".controls").addEventListener("click", (e) => {
  const controlFunctions = {
    "fullscreen": (e) => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { 
        video.msRequestFullscreen();
      }
    },
    "play": (e) => {
      console.log("play")
      if (video.paused) {
        video.play()
        switchControl("play")
      } else {
        video.pause()
        switchControl("pause")
      }
    },
    "volume": (e) => {

    }
  }
  const parentElem = e.target.parentElement
  const classList = parentElem.classList
  if (classList[0] in controlFunctions)  {
    controlFunctions[classList[0]]()
  }
})

function switchVolume(e) {
  const classList = volume_button.children[0].classList
  if (e == "mute") {
    classList.remove("fa-volume-up")
    classList.add("fa-volume-mute")
  } else if (e == "unmute") {
    classList.remove("fa-volume-mute")
    classList.add("fa-volume-up")
  }
}

function switchControl(e) {
  const elem = document.querySelector(".controls .play").children[0].classList
  if (e == "play") {
    elem.remove("fa-play")
    elem.add("fa-pause")
  } else if (e == "pause") {
    elem.remove("fa-pause")
    elem.add("fa-play")
  }
}

function openFullscreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
}

// v Socket stuff below v

socket.on("get-time", (e) => {
  console.log(e)
  socket.emit("send-time", {time: {video: video.currentTime, client: e.time}, targetClient: e.client_id})
})

socket.on("send-time", (e) => {
  console.log(e)
  const sub_date = (Date.now() - e.client.start) / 1000
  video.currentTime = e.video + sub_date
  console.log(e)
})

socket.on("connect", function (e) {
  socket.emit("room-code", room)
  room_joined = true
})

socket.on("video-options", (e) => {
  console.log(e)
  if (e.paused) {
    video.pause()
    switchControl("pause")
  } else {
    video.play()
    switchControl("play")
  }
})

socket.on("message", (e) => {
  console.log(e)
})

// socket.on("client-pause", (e) => {
//   video.
// })