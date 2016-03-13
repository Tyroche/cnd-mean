(function () {
  'use strict';

  angular
    .module('items')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'configurations', {
      title: 'List Items',
      state: 'items.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'configurations', {
      title: 'Create Item',
      state: 'items.create',
      roles: ['admin']
    });
  }
})();
