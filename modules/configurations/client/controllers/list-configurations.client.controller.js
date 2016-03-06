(function () {
  'use strict';

  angular
    .module('configurations')
    .controller('ConfigurationsListController', ConfigurationsListController);

  ConfigurationsListController.$inject = ['ConfigurationsService'];

  function ConfigurationsListController(ConfigurationsService) {
    var vm = this;

    vm.configurations = ConfigurationsService.query();
  }
})();
