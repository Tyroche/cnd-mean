(function() {
  'use strict';

  angular
    .module('messages')
    .controller('ConversationsController', ConversationsController);

  ConversationsController.$inject = [
    '$scope',
    '$resource'
  ];

  function ConversationsController($scope, $resource) {
    var vm = this;

    init();
    function init() {
      // Get the conversations by calling api/conversations
      vm.conversations = $resource('api/conversations').query({}, function(res) {
        return res;
      });
    }
  }
})();
