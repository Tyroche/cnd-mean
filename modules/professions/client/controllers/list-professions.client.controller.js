(function () {
  'use strict';

  angular
    .module('professions')
    .controller('ProfessionsListController', ProfessionsListController);

  ProfessionsListController.$inject = ['ProfessionsService'];

  function ProfessionsListController(ProfessionsService) {
    var vm = this;

    vm.professions = ProfessionsService.query();
  }
})();
