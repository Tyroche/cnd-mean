(function () {
  'use strict';

  angular
    .module('races')
    .controller('RacesListController', RacesListController);

  RacesListController.$inject = ['RacesService'];

  function RacesListController(RacesService) {
    var vm = this;

    vm.races = RacesService.query();
  }
})();
