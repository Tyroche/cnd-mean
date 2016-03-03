(function () {
  'use strict';

  angular
    .module('wikis')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Wikis',
      state: 'wikis',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'wikis', {
      title: 'List Wikis',
      state: 'wikis.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'wikis', {
      title: 'Create Wiki',
      state: 'wikis.create',
      roles: ['user']
    });
  }
})();
