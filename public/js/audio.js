const Howler = require('howler')
const Howl   = Howler.Howl
const Nes    = require('nes/client')
const client = new Nes.Client('ws://localhost:8000')

let player, preloader

function preloadTrack(src) {
  if (preloader) { preloader.unload() }
  preloader = new Howl({
    src: src,
    preload: false,
    autoplay: false
  }).load()
}

client.connect(function (err) {
  const seekToCurrentPosition = () => {
    client.request('/current_position', (err, payload) => {
      player.seek(payload.time)
      player.play()
      if (payload.preload) { preloadTrack(payload.preload)}
    })
  }

  const loadTrack = (track) => {
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
    client.request('/current_position', (err, payload) => {
      loadTrack(payload).on('end', getAndPlayTrack)
    })
  }

  getAndPlayTrack()
})
