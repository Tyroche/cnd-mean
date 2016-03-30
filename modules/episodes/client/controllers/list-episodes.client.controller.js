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
      var mostPopularContract = {
        contract: episode.contracts[0] ? episode.contracts[0] : { name: 'None' },
        numVotes: 0
      };

      episode.contracts.forEach(function(contract) {
        var numVotes = episode.attendees.filter(function (attendee) {
          return contract._id === attendee.contractVote;
        }).length;

        if(numVotes > mostPopularContract.numVotes) {
          mostPopularContract = {
            contract: contract,
            numVotes: numVotes
          };
        }
      });

      return mostPopularContract.contract.name;
    }
  }
})();
