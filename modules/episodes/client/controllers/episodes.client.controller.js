(function () {
  'use strict';

  // Episodes controller
  angular
    .module('episodes')
    .controller('EpisodesController', EpisodesController);

  EpisodesController.$inject = ['$scope', '$state', 'Authentication', 'episodeResolve', 'ConfigurationsService', 'ContractsService'];

  function EpisodesController ($scope, $state, Authentication, episode, ConfigurationsService, ContractsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.maximumSessionSize = 4;
    vm.episode = episode;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.sumRewards = sumRewards;

    // Calendar stuff
    $scope.calendar = {
      opened: false
    };
    $scope.openCalendar = function() {
      $scope.calendar.opened = true;
      console.log($scope.calendar.opened);
    };

    // Get possible configurations
    ConfigurationsService.query({ enabled: true }, function(res) {
      if (!vm.episode.maxAttendees || vm.episode.maxAttendees === 0){
        vm.episode.maxAttendees = res[0].maximumSessionSize;
      }
    });

    // Get possible contracts
    ContractsService.query({ elected: false, enabled: true }, function(res) {
      vm.contracts = res;
    });

    // Summarize all monetary rewards for this contract
    function sumRewards(contract) {
      return contract.rewards.reduce(function(prev, curr) {
        // Check to see if curr's unit indicates it's monetary
        if (curr.unit === 'riphons' || curr.unit === 'Riphons') {
          // If prev is an obj, it will have a unit; otherwise it's just a value
          if (!prev.unit) {
            return prev + curr.amount;
          }

          // otherwise check to see if it's monetary
          if (prev.unit === 'riphons' || prev.unit === 'Riphons') {
            return prev.amount + curr.amount;
          }

          // Otherwise just return the current value
          return curr.amount;
        }

        // Default: Return the amount of the previous if it exists or 0
        return prev.unit ? prev.amount : 0;
      });
    }

    // Remove existing Episode
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.episode.$remove($state.go('episodes.list'));
      }
    }

    // Save Episode
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.episodeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.episode._id) {
        vm.episode.$update(successCallback, errorCallback);
      } else {
        vm.episode.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('episodes.view', {
          episodeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
