(function () {
  'use strict';

  angular
    .module('messages')
    .directive('messageContainer', messageContainer);

  messageContainer.$inject = [
    '$resource',
    '$timeout',
    '$filter',
    '$interval'
  ];

  function messageContainer($resource, $timeout, $filter, $interval) {
    var controller = function($scope) {
      var vm = this;
      vm.messages = [];
      vm.user = JSON.parse($scope.user)._id;
      vm.continuousMessageService = null;
      vm.checkingInterval = 1250;
      console.log($scope.display);

      // Resolve the promise of whatever is loading
      Promise.resolve($scope.context).then(function(data){
        vm.context = data;
        init();
      });

      // Cancel the $interval on navigation away from container
      $scope.$on('$destroy', function() {
        if(vm.continuousMessageService) {
          $interval.cancel(vm.continuousMessageService);
        }
      });

      // Get the first messages (or look for them if there are none so far)
      function getFirstMessages() {
        vm.ctxMessages.query({}, function(res) {
          vm.messages = $filter('orderBy')(res,'created', true);
          // If null, we won't check for "since", we'll just reuse this one
          vm.lastQuery = vm.messages[0] ? vm.messages[0].created : null;
        });
      }

      // Used to check for new messages
      function getNewMessages() {
        vm.ctxMessages.query({dateTime: vm.lastQuery}, function(res) {
          if(res.length > 0) {
            vm.messages = vm.messages.concat(res);
            vm.messages = $filter('orderBy')(vm.messages,'created', true);
            vm.lastQuery = vm.messages[0].created;
          }
        });
      }

      // Create a continuously updating service that is destroyed on page-off
      function createUpdater() {
        vm.continuousMessageService = $interval(function() {
          if(vm.lastQuery) {
            getNewMessages();
            return;
          }
          getFirstMessages();
        }, vm.checkingInterval);
      }

      function init() {
        if (vm.context) {
          // Used to query if we don't have messages
          vm.ctxMessages = $resource('/api/messages/context/:contextID', {
            contextID: vm.context._id
          });

          // Get the first messages, then start checking for messages continuously
          getFirstMessages();
          createUpdater();
        }
      }
    };

    return {
      templateUrl: 'modules/messages/client/views/message-container.html',
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
