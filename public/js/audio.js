const Howler = require('howler')
const Howl   = Howler.Howl
const Nes    = require('nes/client')
const client = new Nes.Client('ws://localhost:8000')
const trackList = require('../../lib/tracklist')

let player = new Howl({
  src: trackList[0].mp3,
  preload: false,
  autoplay: false
})
let currentTrack = 1

const loadTrack = (trackNumber) => {
  player.src = [trackList[trackNumber].mp3]
  player.load()
  return player
}

client.connect(function (err) {
  console.log('socket connected');
  let playbackInt, listenerId, currentPosition
  const handler = (update, flags) => {

      // update -> { id: 5, status: 'complete' }
      // Second publish is not received (doesn't match)
  }

  const publishProgress = (timestamp) => {
    console.log('publishProgress');
    client.request(`/audio_progress?listenerId=${listenerId}&seek=${player.seek()}&track=${currentTrack}`)
  }

  const seekToCurrentPosition = () => {
    client.request('/current_position', (err, payload) => {
      console.log(payload);
      player.seek(payload.position)
      player.play()
    })
  }

  client.request('/current_position', (err, payload) => {
    console.log(payload);
    if (isNaN(payload.track)) {
      //first listener
      // return loadTrack(1).play()
    }
    loadTrack(payload.track).on('load', seekToCurrentPosition)
  })

  player.on('play', (timestamp) => {
    listenerId = timestamp
    client.request(`/add_listener?listenerId=${listenerId}`)
    playbackInt = setInterval(publishProgress, 1000)
  })

  // track1.play()
})
