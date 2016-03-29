(function () {
  'use strict';

  angular
    .module('characters')
    .controller('CharactersListController', CharactersListController);

  CharactersListController.$inject = ['CharactersService', 'Authentication'];

  function CharactersListController(CharactersService, auth) {
    var vm = this;

    vm.canCreateCharacter = canCreateCharacter;
    vm.characters = CharactersService.query();

    function canCreateCharacter() {
      return auth.user.roles.indexOf('consultant') > -1 || auth.user.roles.indexOf('admin') > -1;
    }
  }
})();
