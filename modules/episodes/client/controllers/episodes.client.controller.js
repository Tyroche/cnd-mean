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
    vm.isUserPlaying = isUserPlaying;
    vm.toggleAttendance = toggleAttendance;
    vm.voteFor = voteFor;
    vm.getPlayerVotedContract = getPlayerVotedContract;

    init();
    function init() {
      if (!vm.episode.contracts) { vm.episode.contracts = []; }

      vm.formEnabledContracts.forEach(function(obj) {
        if (!obj.voters) { obj.voters = []; }
        if (!obj.rewards) { obj.rewards = []; }
      });
    }

    //--View Accessible Ops-----------------------------------------------------
    // Player is in session
    function isUserPlaying() {
      return vm.episode.attendees.indexOf(Authentication.user._id) > -1;
    }

    function getRemainingSlots() {
      return vm.episode.maxAttendees - vm.episode.attendees.length;
    }

    function toggleAttendance() {
      // Prevent non-consultants from enlisting
      if(Authentication.user.roles.indexOf('consultant') === -1) { return; }

      var attendanceIndex = vm.episode.attendees.indexOf(Authentication.user._id);

      if (attendanceIndex > -1) {
        vm.episode.attendees.splice(attendanceIndex, 1);
        return;
      }

      vm.episode.attendees.push(Authentication.user._id);
    }

    function voteFor(index) {
      // Filter out users who are not playing
      if (!vm.isUserPlaying()) { return; }

      var alreadyVoted = vm.formEnabledContracts.forEach(function(obj) {
        var voterIndex = obj.voters.indexOf(Authentication.user._id);
        if (voterIndex > -1) {
          obj.voters.splice(voterIndex, 1);
        }
      });

      vm.formEnabledContracts[index].voters.push(Authentication.user._id);
    }

    function getPlayerVotedContract() {
      return vm.formEnabledContracts.filter(function (obj) {
        return obj.voters.indexOf(Authentication.user._id) > -1;
      })[0];
    }

    // Summarize all monetary rewards for this contract
    function sumRewards(contract) {
      if (contract.rewards.length === 0) {
        return "No rewards";
      }

      if (contract.rewards.length === 1) {
        return "" + contract.rewards[0].amount + " riphons";
      }

      var rewards = contract.rewards.reduce(function(prev, curr) {
        if (curr.unit.toLowerCase() === 'riphons') {
          if (prev.unit.toLowerCase() === 'riphons') {
            return prev.amount + curr.amount;
          }
          return curr.amount;
        }

        // Default: Return the amount of the previous if it exists or 0
        return prev.unit ? prev.amount : 0;
      });

      return "" + rewards + " riphons";
    }

    //--CALENDAR----------------------------------------------------------------
    $scope.calendar = {
      opened: false
    };
    $scope.openCalendar = function() {
      $scope.calendar.opened = true;
    };

    //--DB Ops------------------------------------------------------------------
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

    //--CRUD--------------------------------------------------------------------
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
