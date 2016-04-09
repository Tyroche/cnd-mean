(function() {
  'use strict';

  angular
    .module('messages')
    .controller('ConversationsController', ConversationsController);

  ConversationsController.$inject = [
    '$scope',
    '$resource',
    '$filter',
    'Authentication'
  ];

  function ConversationsController($scope, $resource, $filter, auth) {
    var vm = this;
    var Conversation = $resource('/api/conversations/:conversationId');

    // Create a new conversation
    vm.createConversation = createConversation;
    function createConversation() {
      if (!vm.newConvoPlayer) { return; }

      vm.selectedConversation = new Conversation();
      vm.selectedConversation.name = "New Convo";
      vm.selectedConversation.isPrivate = true;
      vm.selectedConversation.participants = [
        auth.user,
        vm.newConvoPlayer
      ];
      vm.selectedConversation.$save();
      vm.newConvoPlayer = null;

      // Need to receive a message on the socket
    }

    init();
    function init() {
      // Get the conversations by calling api/conversations
      vm.conversations = $resource('api/conversations').query({}, function(res) {
        return res;
      });

      vm.players = $resource('api/users').query({}, function(res) {
        return res.filter(function(result) {
          if (result.roles.indexOf('admin') > -1){
            result.qualifier = '(GM) ';
            return true;
          }
          result.qualifier = '';
          return result.roles.indexOf('consultant') > -1;
        });
      });
    }
  }
})();
