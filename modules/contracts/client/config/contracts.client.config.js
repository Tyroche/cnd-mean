(function () {
  'use strict';

  angular
    .module('contracts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Episodes',
      state: 'episodes',
      type: 'dropdown',
      position: 3,
      roles: ['admin', 'consultant']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'episodes', {
      title: 'List Contracts',
      state: 'contracts.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'episodes', {
      title: 'Create Contract',
      state: 'contracts.create',
      roles: ['admin']
    });
  }
})();
