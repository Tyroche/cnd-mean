(function () {
  'use strict';

  angular
    .module('spells')
    .controller('SpellsListController', SpellsListController);

  SpellsListController.$inject = ['SpellsService'];

  function SpellsListController(SpellsService) {
    var vm = this;

    vm.spells = SpellsService.query();
  }
})();
