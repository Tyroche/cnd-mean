(function () {
  'use strict';

  angular
    .module('characters')
    .directive('contractDisplay', contractDisplay);

  contractDisplay.$inject = [];

  function contractDisplay() {
    var controller = function($scope) {
      var vm = this;
      vm.contract = $scope.contract;
      vm.character = $scope.character;
      vm.episode = $scope.episode;
      vm.player = $scope.player;

      // Methods
      vm.castVote = castVote;
      vm.canVote = canVote;
      vm.playerVoted = playerVoted;
      vm.numVoters = numVoters;

      // Checks to see if the user is signed up
      function canVote() {
        return vm.episode.attendees.some(function(data){
          return data.user._id === vm.player;
        });
      }

      // Calculate how many votes have been cast for this contract
      function numVoters() {
        return vm.episode.attendees.filter(function(attendee) {
          return attendee.contractVote && attendee.contractVote._id === vm.contract._id;
        }).length;
      }

      // Has the player voted for this contract?
      function playerVoted() {
        return vm.episode.attendees.some(function(attendee) {
          return attendee.user._id === vm.player && attendee.contractVote && attendee.contractVote._id === vm.contract._id;
        });
      }

      // Try to get the
      function castVote() {
        // Get the player's slot as an attendee
        var playerSlot = vm.episode.attendees.filter(function(attendee) {
          return attendee.user._id === vm.player;
        })[0];
        var playerSlotIndex = vm.episode.attendees.indexOf(playerSlot);

        // Change the player's contract vote to this one.
        if (playerSlotIndex > -1) {
          vm.episode.attendees[playerSlotIndex].contractVote = vm.contract;
          vm.episode.$update({
            user: vm.player,
            vote: vm.contract._id
          });
        }
      }
    };

    return {
      templateUrl: 'modules/episodes/client/views/directives/contract-display.subview.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        contract: '=',
        episode: '=',
        character: '@',
        player: '@'
      }
    };
  }
})();
