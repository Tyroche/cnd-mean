(function () {
  'use strict';

  angular
    .module('messages')
    .directive('messageView', messageView);

  messageView.$inject = ['$resource'];

  function messageView($resource) {
    var controller = function($scope) {
      var vm = this;

      init();
      function init() {
        vm.message = JSON.parse($scope.message);
      }
    };

    return {
      templateUrl: 'modules/messages/client/views/message.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        message: '@',
        user: '@'
      }
    };
  }
})();
