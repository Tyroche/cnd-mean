(function () {
  'use strict';

  // Episodes controller
  angular
    .module('episodes')
    .controller('EpisodesController', EpisodesController);

  EpisodesController.$inject = [
    '$scope',
    '$state',
    'Authentication',
    'episodeResolve',
    'ConfigurationsService',
    'ContractsService',
    'ContractVotingService',
    'Admin'];

  function EpisodesController ($scope, $state, Authentication, episode, ConfigurationsService, ContractsService, contractVotingService, admin) {
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
    vm.getUser = getUser;

    init();
    function init() {
      if (!vm.episode.contracts) { vm.episode.contracts = []; }

      // How do we trim this down?
      admin.query({}, function(data) {
        vm.users = data;
        console.log(vm.users);
      });

      vm.formEnabledContracts.forEach(function(obj) {
        if (!obj.voters) { obj.voters = []; }
        if (!obj.rewards) { obj.rewards = []; }
      });
    }

    //--View Accessible Ops-----------------------------------------------------
    // Player is in session
    function isUserPlaying() {
      return contractVotingService.isUserPlaying(vm.episode, Authentication.user);
    }

    function getRemainingSlots() {
      return vm.episode.maxAttendees - vm.episode.attendees.length;
    }

    function toggleAttendance() {
      // Prevent non-consultants from enlisting
      contractVotingService.toggleAttendance(vm.episode, Authentication.user, vm.formEnabledContracts);
    }

    function voteFor(index) {
      contractVotingService.voteForContract(vm.episode, Authentication.user, vm.formEnabledContracts, index);
    }

    function getPlayerVotedContract() {
      return contractVotingService.getVotedContract(vm.formEnabledContracts, Authentication.user);
    }

    function getUser(userId) {
      if(!vm.users) { return; }

      return vm.users.filter(function(obj) {
        return obj._id === userId;
      })[0];
    }

    // Summarize all monetary rewards for this contract
    function sumRewards(contract) {
      if (contract.rewards.length === 0) {
        return 'No rewards';
      }

      if (contract.rewards.length === 1) {
        return '' + contract.rewards[0].amount + ' riphons';
      }

      var rewards = contract.rewards.reduce(function(prev, curr) {
        if (curr.unit.toLowerCase() === 'riphons') {
          if (!prev.unit) {
            return prev + curr.amount;
          }

          if (prev.unit.toLowerCase() === 'riphons') {
            return prev.amount + curr.amount;
          }
          return curr.amount;
        }

        // Default: Return the amount of the previous if it exists or 0
        return prev.unit ? prev.amount : 0;
      });

      return '' + rewards + ' riphons';
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
