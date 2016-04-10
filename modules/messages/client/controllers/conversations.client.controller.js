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
      if (!vm.newConvoTargets[0]) { return; }

      // Create the model
      vm.selectedConversation = new Conversation();
      vm.selectedConversation.name = "New Convo";
      vm.selectedConversation.isPrivate = true;
      vm.selectedConversation.participants = [ auth.user ];
      vm.newConvoTargets.forEach(function (target) {
        vm.selectedConversation.participants.push(target);
      });

      vm.selectedConversation.$save();
      vm.newConvoPlayer = [];

      // Need to receive a message on the socket
    }

    // Provide a list of names of people participating in a conversation
    vm.conversationParticipants = conversationParticipants;
    function conversationParticipants(conversation) {
      // Intersect participants and players... not pretty but works.
      var participants = vm.players.filter(function(player) {
        return conversation.participants.some(function(participant) {
          return participant === player._id;
        });
      });

      // Return a list of names separated by commas
      return participants.reduce(function(cur, next) {
        var name = next.firstName + ' ' + next.lastName;
        if(participants.indexOf(next) > 0) {
          return cur + ', ' + name;
        }
        return name;
      }, '');
    }

    init();
    function init() {
      // Get the conversations by calling api/conversations
      vm.conversations = $resource('api/conversations').query({}, function(res) {
        return res;
      });

      vm.newConvoTargets = [];
      vm.players = [];
      $resource('api/users').query({}, function(res) {
        vm.players = res.filter(function(result) {
          if (result._id === auth.user._id) { return;}

          if (result.roles.indexOf('admin') > -1) {
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
