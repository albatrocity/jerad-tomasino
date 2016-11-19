const Howler = require('howler')
const Howl   = Howler.Howl
const axios  = require('axios')

let player, preloader
let audible = true

function preloadTrack(src) {
  if (preloader) { preloader.unload() }
  preloader = new Howl({
    src: src,
    preload: false,
    autoplay: false
  }).load()
}

(function() {
  function seekToCurrentPosition() {
    return axios.get('/current_position').then((res) => {
      const payload = res.data
      player.seek(payload.time)
      player.play()
      if (payload.preload) { preloadTrack(payload.preload)}
    })
  }

  function loadTrack(track) {
    if (player) {player.unload() }
    player = new Howl({
      src: track.mp3,
      preload: false,
      autoplay: false
    })
    player.on('load', seekToCurrentPosition)
    player.load()
    return player
  }

  function getAndPlayTrack() {
    axios.get('/current_position').then((res) => {
      const payload = res.data
      return loadTrack(payload).on('end', getAndPlayTrack)
    })
  }

  function mutedText(audible) {
    if (audible) {
      return 'tune in'
    }
    return 'tune out'
  }

  getAndPlayTrack()

  document.getElementById('mute').addEventListener('click', (e) => {
    e.preventDefault()
    player.mute(audible)
    e.target.innerText = mutedText(audible)
    audible = !audible
  })
})()
