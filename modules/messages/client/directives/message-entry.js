(function () {
  'use strict';

  angular
    .module('messages')
    .directive('messageEntry', messageEntry);

  messageEntry.$inject = ['$resource'];

  function messageEntry($resource) {
    var controller = function($scope) {
      var vm = this;
      var Message = $resource('/api/messages/:messageId');

      // Resolve the Socket Promise
      $scope.socket.then(function(sock) {
        vm.socket = sock;
      });

      init();
      function init() {
        vm.user = JSON.parse($scope.user);
        createNew();
      }

      // Evaluate input to determine type
      function evaluateMessageType() {
        // Check for a roll
        if (vm.message.contents.substring(0, 6) === '/roll ') {
          // replace with regex
          var [numDice, predicate] = vm.message.contents.substring(6).split('d');
          var modifier = 0;

           // Malformed, send as message instead
          if(!predicate) { return; }

          // Get Modifier: Positive
          if(predicate.indexOf('+') > -1) {
            [predicate, modifier] = predicate.split('+');
            modifier = parseInt(modifier);
          }

          // Get Modifier: Negative
          if(predicate.indexOf('-') > -1) {
            [predicate, modifier] = predicate.split('-');
            modifier = parseInt(modifier) * -1;
          }

          // Actually do the rolls
          var results = [];
          for (var i=0; i < parseInt(numDice); i++) {
            results.push(Math.ceil(Math.random()*parseInt(predicate)));
          }

          // Reduce and add modifier
          var total = results.reduce(function(value, current) {
            return value + current;
          }, modifier);

          console.log(results.join(', ') + ' + ' + modifier + " --> " + total);
        }

        // check for an emote
        if (['/me ','/em '].indexOf(vm.message.contents.substring(0, 4)) > -1) {
          return;
        }
      }


      // Create a new message that will be sent
      function createNew() {
        vm.message = new Message();
        vm.message.sender = {
          _id: vm.user._id,
          firstName: vm.user.firstName,
          lastName: vm.user.lastName,
          profileImageURL: vm.user.profileImageURL
        };
        vm.message.publicity = Boolean($scope.private) ? 'private' : 'public';
        if($scope.character) {
          vm.message.character = JSON.parse($scope.character)._id;
        }
      }

      // Load a message
      vm.postMessage = postMessage;
      function postMessage() {
        // Assign these at Post, just in case this changed at all
        vm.message.context = $scope.context._id;
        vm.message.participants = $scope.participants ? $scope.participants : [];

        // Send a post message if the socket exists
        vm.message.$save(successCallback, errorCallback);
        if(vm.socket) {
          vm.socket.emit('postMessage', vm.message);
        }

        evaluateMessageType();

        // Recreate a new Message
        createNew();
      }

      function successCallback(res) {
        console.log('Created successfully');
        //console.log(res);
        createNew();
      }

      function errorCallback(res) {
        console.log('Could not send message!');
      }
    };

    return {
      templateUrl: 'modules/messages/client/views/message-entry.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        socket: '=',
        user: '@',
        character: '@',
        participants: '=',
        private: '@',
        context: '='
      }
    };
  }
})();
