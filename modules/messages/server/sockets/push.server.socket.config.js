'use strict';

module.exports = function(io, socket) {
    console.log('======== ===== Connected ======= ===== ');
    io.emit('pushUpdate', {
      contents: 'Welcome',
      sender: 'Evan Kirsch',
      created: Date.now()
    });

    // On new message, send a push notification to sockets matching the same contextId
    socket.on('postMessage', function(received) {
      // We will need to verify that it's public
      var broadcast = {
        contents: received.contents,
        sender: received.sender,
        context: received.context
      };

      io.emit('pushUpdate', broadcast);
    });
};
