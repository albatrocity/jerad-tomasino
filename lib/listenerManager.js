module.exports = class ListenerManager {
  constructor() {
    this.listeners = []
  }
  addListener(listenerId) {
    this.listeners.push({id: listenerId, position: null, track: 1})
  }
  updateListenerPosition(listenerId, position) {
    let existing = this.listeners.find(l => l.id == listenerId)
    if(!existing) {return}
    existing['position'] = position
    return existing
  }
  currentPosition() {
    return {
      track: Math.max.apply( Math, this.listeners.map(l => l.track) ),
      position: this.listeners.reduce((mem, l) => {
        if (!l) {return mem+0}
        if (!l.position) { return mem+0}
        console.log(mem);
        return mem + l.position
      }, 0)/this.listeners.length
    }
  }
}
