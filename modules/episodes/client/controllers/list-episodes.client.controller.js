(function () {
  'use strict';

  angular
    .module('episodes')
    .controller('EpisodesListController', EpisodesListController);

  EpisodesListController.$inject = [
    'Authentication',
    'EpisodesService',
    'ContractsService',
    'ContractVotingService'
  ];

  function EpisodesListController(auth, EpisodesService, contractsService, votingService) {
    var vm = this;
    vm.getHighestVotedContract = getHighestVotedContract;
    vm.canCreate = canCreate;

    vm.episodes = EpisodesService.query();
    vm.contracts = contractsService.query();

    function canCreate() {
      return auth.user.roles.indexOf('admin') > -1;
    }

    function getHighestVotedContract(episode) {
      return votingService.getHighestVotedContract(episode, vm.contracts);
    }
  }
})();
