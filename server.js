const Hapi            = require('hapi')
const ListenerManager = require('./lib/listenerManager')
const tracklist       = require('./lib/tracklist')

// Create a server with a host and port
const server = new Hapi.Server()
server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 8000
})


let goodOptions = {
  reporters: [{
    reporter: require('good-console'),
    events: { log: ['error'], response: '*' }
  }]
}

let currentTime = 225

function startLoopTimer() {
  setInterval(function(){
    if ( currentTime >= tracklist[tracklist.length-1].end-1) {
      currentTime = -1
    }
    currentTime = currentTime + 1
    console.log(currentTime)
  }, 1000)
}

server.register([{
  register: require('good'),
  options: goodOptions
},
  require('inert')
], (err) => {
  let manager = new ListenerManager

  server.route({
    method: 'GET',
    path: '/audio_progress',
    handler: (request, reply) => {
      const { query } = request
      manager.updateListenerPosition(query.listenerId, query.seek)
      reply()
    }
  })

  server.route({
    method: 'GET',
    path: '/current_position',
    handler: (request, reply) => {
      const { query } = request
      reply(manager.currentPlayback(currentTime))
    }
  })

  server.route({
    method: 'GET',
    path: '/add_listener',
    handler: (request, reply) => {
      const { query } = request
      manager.addListener(query.listenerId, true)
      reply()
    }
  })

  // Add the route
  server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
      return reply.file('./public/index.html')
    }
  })


  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public',
        listing: true
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/{filename}',
    handler: {
      file: function (request) {
        return `./public/${request.params.filename}`
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/bundle.js',
    handler: {
      file: function (request) {
        return `./public/compiled/js/bundle.js`
      }
    }
  })

  // Start the server
  server.start((err) => {

    if (err) {
      throw err
    }
    console.log('Server running at:', server.info.uri)
    startLoopTimer()
  })

})
