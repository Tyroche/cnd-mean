(function () {
  'use strict';

  angular
    .module('episodes')
    .controller('EpisodesListController', EpisodesListController);

  EpisodesListController.$inject = ['EpisodesService'];

  function EpisodesListController(EpisodesService) {
    var vm = this;

    vm.episodes = EpisodesService.query();
  }
})();
