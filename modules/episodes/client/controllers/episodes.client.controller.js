(function () {
  'use strict';

  // Episodes controller
  angular
    .module('episodes')
    .controller('EpisodesController', EpisodesController);

  EpisodesController.$inject = [
    '$scope',
    '$state',
    '$resource',
    'Authentication',
    'episodeResolve',
    'ContractVotingService'];

  function EpisodesController ($scope, $state, $resource, Authentication, episode, contractVotingService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.maximumSessionSize = 4;
    vm.episode = episode;
    vm.formEnabledContracts = [];
    vm.chosenCharacter = '';
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.isUserPlaying = isUserPlaying;
    vm.toggleAttendance = toggleAttendance;
    vm.getPlayerVotedContract = getPlayerVotedContract;
    vm.removeContract = removeContract;
    vm.contractIsEnabled = contractIsEnabled;

    init();
    function init() {
      if (!vm.episode.contracts) { vm.episode.contracts = []; }

      // Offload later
      if($state.current.name === 'episodes.edit' || $state.current.name === 'episodes.create') {
        $resource('api/contracts').query({}, function(res) {
          if (!res[0]) {
            console.log('ERROR: No Contracts found!!!');
            return [];
          }
          vm.formEnabledContracts = res;
        });
      }

      vm.formEnabledContracts.forEach(function(obj) {
        if (!obj.rewards) { obj.rewards = []; }
      });

      getPlayerCharacters();
    }

    //--View Accessible Ops-----------------------------------------------------
    // Player is in session
    function isUserPlaying() {
      return contractVotingService.isUserPlaying(vm.episode, Authentication.user);
    }

    function toggleAttendance() {
      // Prevent non-consultants from enlisting
      contractVotingService.toggleAttendance(vm.episode, Authentication.user, vm.chosenCharacter, vm.formEnabledContracts);
    }

    function getPlayerVotedContract() {
      return contractVotingService.getVotedContract(vm.formEnabledContracts, Authentication.user);
    }

    function getPlayerCharacters(player) {
      if (vm.playerCharacters) { return; }

      $resource('api/characters').query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No Characters found!!!');
          return [];
        }
        vm.playerCharacters = res.filter(function(char) {
          return char.player._id === Authentication.user._id;
        });

      });
    }

    function removeContract(contract) {
      var res = null;
      vm.episode.contracts.some(function(curVal, index) {
        if(curVal._id === contract._id){
          res = index;
          return true;
        }
        return false;
      });
      vm.episode.contracts.splice(res, 1);
    }

    function contractIsEnabled(contract) {
      // bandaid
      if(!contract) { return; }

      return vm.episode.contracts && vm.episode.contracts.some(function(val) {
        return val._id === contract._id;
      });
    }

    //--CALENDAR----------------------------------------------------------------
    $scope.calendar = {
      opened: false
    };
    $scope.openCalendar = function() {
      $scope.calendar.opened = true;
    };

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
