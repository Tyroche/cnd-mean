(function () {
  'use strict';

  angular
    .module('contracts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'characters', {
      title: 'Contracts',
      state: 'contracts.list',
      roles: ['admin']
    });
  }
})();
