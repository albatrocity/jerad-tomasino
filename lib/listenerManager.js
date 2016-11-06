const tracklist = require('./tracklist')

module.exports = class ListenerManager {
  constructor() {
    this.listeners = []
  }
  addListener(listenerId, isNew) {
    this.listeners.push({id: listenerId, position: null, track: 1, isNew })
  }
  getTrackFromTime(time) {
    return tracklist.find((track) => {
      return track.start <= time && track.end > time
    })
  }
  updateListenerPosition(listenerId, position) {
    let existing = this.listeners.find(l => l.id == listenerId)
    if(!existing) {return}
    existing['position'] = position
    existing['isNew'] = false
    return existing
  }
  currentPosition() {
    return {
      track: Math.max.apply( Math, this.listeners.map(l => l.track) ),
      position: this.listeners.filter(l => !l.isNew).reduce((mem, l) => {
        if (!l) {return mem+0}
        if (!l.position) { return mem+0}
        return mem + l.position
      }, 0)/this.listeners.length
    }
  }
  currentPlayback(time) {
    const track = this.getTrackFromTime(time)
    let nextTrack, preloader
    if ( tracklist.indexOf(track) === tracklist.length-1 ) {
      nextTrack = tracklist[0]
    } else {
      nextTrack = tracklist[tracklist.indexOf(track)+1]
    }
    preloader = nextTrack.mp3
    return {
      mp3: track.mp3,
      time: time - track.start,
      preload: preloader
    }
  }
}
