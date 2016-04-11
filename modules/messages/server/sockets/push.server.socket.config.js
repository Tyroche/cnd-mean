'use strict';

module.exports = function(io, socket) {

  // When a user joins a chat, they subscribe to a particular context ID which
  // essentially acts as a room
  socket.on('subscribe', function(context) {
    socket.join(context);
  });

    // On new message, send a push notification to sockets matching the same contextId
  socket.on('postMessage', function(received) {

    // We will need to verify that it's public
    var broadcast = {
      contents: received.contents,
      sender: received.sender,
      context: received.context
    };

    io.sockets.in(received.context).emit('pushUpdate', broadcast);
  });
};
