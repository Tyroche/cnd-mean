'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket',
  function ($scope, $location, Authentication, Socket) {
    // Create a messages array
    $scope.messages = [];

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
    });

    // Do a roll
    function sendRoll (msg) {
      // Use a regex to capture the num and die type
      var captureRegex = /(\d*)d(\d*)[+-]*(\d*)/g;
      var diceResults = captureRegex.exec(msg);

      var numDice = diceResults[1] ? diceResults[1] : 1;
      var dieType = diceResults[2] ? diceResults[2] : 20;
      var total = 0;
      for(var i = 0; i < numDice; i++) {
        total += Math.ceil(Math.random() * dieType);
      }

      var message = {
        text: 'rolled a ' + msg + ' and got ' + total,
        msgType: 'roll'
      };

      Socket.emit('chatMessage', message);
    }

    // Send a Chat Message
    function sendChat (msg) {
      var message = {
        text: msg
      };

      // Emit a 'chatMessage' message event
      console.log('Chat ' + msg);
      Socket.emit('chatMessage', message);
    }


    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // Get the msg and then clear messageText
      var msg = this.messageText;
      this.messageText = '';

      if (msg.indexOf('/roll') > -1) {
        msg = msg.replace('/roll ', '');
        sendRoll(msg);
        return;
      }

      sendChat(msg);
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
  }
]);
