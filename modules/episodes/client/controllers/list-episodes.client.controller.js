(function () {
  'use strict';

  angular
    .module('episodes')
    .controller('EpisodesListController', EpisodesListController);

  EpisodesListController.$inject = ['EpisodesService'];

  function EpisodesListController(EpisodesService) {
    var vm = this;
    vm.getHighestVotedContract = getHighestVotedContract;

    vm.episodes = EpisodesService.query();

    function getHighestVotedContract(episode) {
      if (!episode.contracts) {
        return "No contracts yet";
      }

      if (episode.contracts.filter(function (obj) { return !obj.voters; } ).length > 0) {
        return "No votes cast";
      }

      var res = Math.max.apply(Math, episode.contracts.map(function(obj) {
        return obj.voters.length;
      }));

      return res;
    }
  }
})();
