(function() {
  'use strict';

  angular
    .module('messages')
    .controller('ConversationsController', ConversationsController);

  ConversationsController.$inject = [
    '$scope',
    '$resource',
    '$filter',
    'Authentication',
    'Socket'
  ];

  function ConversationsController($scope, $resource, $filter, auth, socket) {
    var vm = this;
    var Conversation = $resource('/api/conversations/:conversationId');
    vm.auth = auth;

    // Create a new conversation
    vm.createConversation = createConversation;
    function createConversation() {
      // Validate that we have targets... if not, kill the process.
      if (!vm.newConvoTargets[0]) { return; }

      // Create the model
      vm.selectedConversation = new Conversation();
      vm.selectedConversation.name = 'New Convo';
      vm.selectedConversation.isPrivate = true;
      vm.selectedConversation.participants = [ auth.user ];
      vm.newConvoTargets.forEach(function (target) {
        vm.selectedConversation.participants.push(target);
      });

      // Save and clear out newConvoTargets
      vm.selectedConversation.$save();
      vm.newConvoTargets = [];

      // Query for new conversations
      queryConvos();
    }

    // Select a conversation for loading
    vm.select = select;
    function select(conversation) {
      vm.selectedConversation = conversation;
      $scope.$broadcast('selectConvo', conversation);
    }

    vm.unaddedConvoTargets = unaddedConvoTargets;
    function unaddedConvoTargets() {
      return vm.players.filter(function (target) {
        return vm.newConvoTargets.indexOf(target) === -1;
      });
    }

    // Provide a list of names of people participating in a conversation
    vm.conversationParticipants = conversationParticipants;
    function conversationParticipants(conversation) {
      // Return a list of names separated by commas
      var notMe = conversation.participants.filter(function(current) {
        return current._id !== auth.user._id;
      });

      notMe = notMe.map(function(current) {
        return current.firstName + ' ' + current.lastName;
      });

      return notMe.join(', ');
    }


    function queryConvos() {
      vm.conversations = $resource('api/conversations').query({}, function(res) {
        if(res[0]) {
          vm.selectedConversation = res[0];
        }
        return res;
      });
    }

    // Initialize
    init();
    function init() {
      // Get the conversations by calling api/conversations
      queryConvos();

      // Populate Player Targets
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
