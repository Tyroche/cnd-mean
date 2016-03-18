(function () {
  'use strict';

  angular
    .module('backgrounds')
    .controller('BackgroundsListController', BackgroundsListController);

  BackgroundsListController.$inject = ['BackgroundsService'];

  function BackgroundsListController(BackgroundsService) {
    var vm = this;

    vm.backgrounds = BackgroundsService.query();
  }
})();
