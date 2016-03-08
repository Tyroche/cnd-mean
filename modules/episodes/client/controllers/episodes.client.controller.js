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
    vm.formEnabledContracts = [];
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.sumRewards = sumRewards;
    vm.getRemainingSlots = getRemainingSlots;

    // Calendar stuff
    $scope.calendar = {
      opened: false
    };
    $scope.openCalendar = function() {
      $scope.calendar.opened = true;
    };

    // Get possible configurations
    ConfigurationsService.query({ enabled: true }, function(res) {
      if (!vm.episode.maxAttendees || vm.episode.maxAttendees === 0){
        vm.episode.maxAttendees = res[0].maximumSessionSize;
      }
    });

    // Get possible contracts
    ContractsService.query({}, function(res) {
      // Get All contracts
      vm.contracts = res;

      var contractEnabled = function (obj){
        return vm.episode.contracts.indexOf(obj._id) > -1;
      };

      // Match enabled Contracts and figure out which are enabled in scope
      vm.formEnabledContracts = vm.contracts.filter(contractEnabled);
      $scope.enabled = vm.contracts.map(contractEnabled);
    });

    function getRemainingSlots() {
      return vm.episode.maxAttendees - vm.episode.attendees.length;
    }

    // Summarize all monetary rewards for this contract
    function sumRewards(contract) {

      if (contract.rewards.length === 1) {
        return "" + contract.rewards[0].amount + " riphons";
      }

      var rewards = contract.rewards.reduce(function(prev, curr) {
        // Check to see if curr's unit indicates it's monetary
        if (curr.unit.toLowerCase() === 'riphons') {
          // If prev is an obj, it will have a unit; otherwise it's just a value
          if (!prev.unit) {
            return prev + curr.amount;
          }

          // otherwise check to see if it's monetary
          if (prev.unit.toLowerCase() === 'riphons') {
            return prev.amount + curr.amount;
          }

          // Otherwise just return the current value
          return curr.amount;
        }

        // Default: Return the amount of the previous if it exists or 0
        return prev.unit ? prev.amount : 0;
      });
      return "" + rewards + " riphons";
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

      vm.episode.contracts = vm.contracts.filter(function (contract){
        return $scope.enabled[vm.contracts.indexOf(contract)];
      });


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
