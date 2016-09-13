module.exports = class ListenerManager {
  constructor() {
    this.listeners = [],
    this.prevState = {}
  }
  addListener(listenerId) {
    this.listeners.push({id: listenerId, position: 0, track: 1})
  }
  updateListenerPosition(listenerId, position) {
    let existing = this.listeners.find(l => l.id == listenerId)
    if(!existing) {return}
    existing['position'] = position
    return existing
  }
  pruneListeners() {
    this.listeners.forEach((listener) => {
      let existing = this.prevState[listener.id]
      if (existing && existing == listener.position) {
        existing = this.listeners.find(l => l.id == listener.id)
        console.log('REMOVING LISTENER!')
        delete this.prevState[listener.id]
        this.listeners = this.listeners.splice(this.listeners.indexOf(existing, 1))
      }
      this.listeners.map((l) => {
        return this.prevState[l.id] = l.position
      })
      return this.listeners
    })
  }
  currentPosition() {

    return {
      track: Math.max.apply( Math, this.listeners.map(l => l.track) ),
      position: Math.max.apply( Math, this.listeners.map(l => l.position) )
      // position: this.listeners.reduce((mem, l) => {
      //   if (!l) {return mem+0}
      //   if (!l.position) { return mem+0}
      //   console.log('reducer position:', l.position)
      //   console.log('reducer mem:', mem)
      //   console.log('FINAL SOLUTION:', mem + parseFloat(l.position))
      //   return parseFloat(mem) + parseFloat(l.position)
      // }, 0)/parseInt(this.listeners.length)
    }
  }
}
