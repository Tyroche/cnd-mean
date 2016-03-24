(function () {
  'use strict';

  angular
    .module('characters')
    .controller('CharactersListController', CharactersListController);

  CharactersListController.$inject = ['CharactersService'];

  function CharactersListController(CharactersService) {
    var vm = this;

    vm.characters = CharactersService.query();
  }
})();