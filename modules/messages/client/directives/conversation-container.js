(function () {
  'use strict';

  angular
    .module('messages')
    .directive('conversationContainer', conversationContainer);

  conversationContainer.$inject = [
    '$resource',
    '$timeout',
    '$filter',
    'Socket'
  ];

  function conversationContainer($resource, $timeout, $filter, socket) {
    var controller = function($scope) {
      var vm = this;
      vm.messages = [];
      vm.user = JSON.parse($scope.user);
      vm.continuousMessageService = null;
      vm.checkingInterval = 1250;

      // Resolve the promise of whatever is loading
      Promise.resolve($scope.context).then(function(data){
        vm.context = data;
        init();
      });

      // Promise the socket to Message-Entry
      vm.promiseSocket = new Promise(function(resolve, reject) {
        resolve(socket);
      });

      // When we receive a new message, append it to our list
      socket.on('newMessage', function(message) {
        vm.messages.push(message);
      });

      $scope.$on('$destroy', function() {
        socket.removeListener('newMessage');
      });

      $scope.$on('selectConvo', function(req) {
        vm.context = req.targetScope.vm.selectedConversation;
        console.log('context is now ' + vm.context._id);
        updateRooms();
      });

      // Get the first messages (or look for them if there are none so far)
      function getFirstMessages() {
        if (!vm.context) { return; }

        // Used to query if we don't have messages
        vm.ctxMessages = $resource('/api/messages/context/:contextID', {
          contextID: vm.context._id
        });

        vm.ctxMessages.query({}, function(res) {
          vm.messages = $filter('orderBy')(res,'created');
        });
      }

      function updateRooms() {
        // Connect the socket for push notifications
        if(!socket.socket) { socket.connect(); }

        // Tell the server that we want to subscribe to this context
        socket.emit('subscribe', vm.context._id);
        getFirstMessages();
      }

      function init() {
        updateRooms();
      }
    };

    return {
      templateUrl: 'modules/messages/client/views/conversation-container.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        context: '=',
        display: '@',
        user: '@'
      }
    };
  }
})();
