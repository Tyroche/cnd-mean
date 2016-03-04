(function () {
  'use strict';

  angular
    .module('characters')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Characters',
      state: 'characters',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'characters', {
      title: 'View Characters',
      state: 'characters.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'characters', {
      title: 'Create Character',
      state: 'characters.create',
      roles: ['admin', 'user']
    });
  }
})();
