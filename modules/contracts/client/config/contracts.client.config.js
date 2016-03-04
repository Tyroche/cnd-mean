(function () {
  'use strict';

  angular
    .module('contracts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Contracts',
      state: 'contracts',
      position: 100,
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'contracts', {
      title: 'List Contracts',
      state: 'contracts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'contracts', {
      title: 'Create Contract',
      state: 'contracts.create'
    });
  }
})();
