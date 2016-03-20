(function () {
  'use strict';

  angular
    .module('items')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Items',
      state: 'items.list'
    });
  }
})();
