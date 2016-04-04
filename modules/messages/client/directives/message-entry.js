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
        vm.context = JSON.parse($scope.context);
        vm.user = JSON.parse($scope.user);
        createNew();
      }

      // Create a new message that will be sent
      function createNew() {
        vm.message = new Message();
        vm.message.sender = {
          _id: vm.user._id,
          firstName: vm.user.firstName,
          lastName: vm.user.lastName
        };
        vm.message.publicity = Boolean($scope.private) ? 'private' : 'public';
        vm.message.context = vm.context._id;
        if($scope.character) {
          vm.message.character = JSON.parse($scope.character)._id;
        }
      }

      // Load a message
      vm.postMessage = postMessage;
      function postMessage() {
        vm.message.$save(successCallback, errorCallback);

        // Send a post message if the socket exists
        if(vm.socket) {
          vm.socket.emit('postMessage', vm.message);
        }

        // Recreate a new Message
        createNew();
      }

      function successCallback(res) {
        createNew();
      }

      function errorCallback(res) {
        console.log(res);
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
        public: '@',
        context: '@'
      }
    };
  }
})();
