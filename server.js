'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: process.env.PORT || 8000
});


let goodOptions = {
  reporters: [{
    reporter: require('good-console'),
    events: { log: ['error'], response: '*' }
  }]
}

server.register([{
  register: require('good'),
  options: goodOptions
},
  require('inert')
], (err) => {
  // Add the route
  server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
      return reply.file('./public/index.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public',
        listing: true
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/{filename}',
    handler: {
      file: function (request) {
        return `./public/${request.params.filename}`;
      }
    }
  });

  // Start the server
  server.start((err) => {

    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });

})
