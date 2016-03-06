(function () {
  'use strict';

  angular
    .module('configurations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Configuration',
      state: 'configurations',
      type: 'dropdown',
      position: 10,
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'configurations', {
      title: 'Manage Campaign Configurations',
      state: 'configurations.list'
    });
  }
})();
