(function () {
  'use strict';

  angular
    .module('wikis')
    .controller('WikisListController', WikisListController);

  WikisListController.$inject = ['WikisService'];

  function WikisListController(WikisService) {
    var vm = this;

    vm.wikis = WikisService.query();
  }
})();
