(function () {
  'use strict';

  angular
    .module('episodes')
    .controller('EpisodesListController', EpisodesListController);

  EpisodesListController.$inject = [
    'EpisodesService',
    'ContractsService',
    'ContractVotingService'
  ];

  function EpisodesListController(EpisodesService, contractsService, votingService) {
    var vm = this;
    vm.getHighestVotedContract = getHighestVotedContract;

    vm.episodes = EpisodesService.query();
    vm.contracts = contractsService.query();

    function getHighestVotedContract(episode) {
      return votingService.getHighestVotedContract(episode, vm.contracts);
    }
  }
})();
