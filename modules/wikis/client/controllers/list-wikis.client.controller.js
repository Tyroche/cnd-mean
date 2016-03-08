(function () {
  'use strict';

  angular
    .module('wikis')
    .controller('WikisListController', WikisListController);

  WikisListController.$inject = ['WikisService', 'Authentication'];

  function WikisListController(WikisService, Authentication) {
    var vm = this;
    vm.isAdmin = isAdmin;

    function isAdmin() {
      return Authentication.user.roles.indexOf('admin') > -1;
    }

    vm.wikis = WikisService.query();
  }
})();
