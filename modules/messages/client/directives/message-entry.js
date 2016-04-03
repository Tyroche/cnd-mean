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

      init();
      function init() {
        vm.context = JSON.parse($scope.context);
        createNew();
      }

      // Create a new message that will be sent
      function createNew() {
        vm.message = new Message();
        vm.message.sender = $scope.user;
        vm.message.publicity = Boolean($scope.private) ? 'private' : 'public';
        vm.message.context = vm.context._id;
        if($scope.character) {
          vm.message.character = JSON.parse($scope.character)._id;
        }
      }

      // Load a message
      vm.postMessage = postMessage;
      function postMessage($event) {
        // Evaluate what's happening
        vm.message.$save(successCallback, errorCallback);
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
        user: '@',
        character: '@',
        public: '@',
        context: '@'
      }
    };
  }
})();
