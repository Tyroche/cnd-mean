(function () {
  'use strict';

  angular
    .module('characters')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Guild',
      state: 'characters',
      position: 1,
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'characters', {
      title: 'View Guild Members',
      state: 'characters.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'characters', {
      title: 'Create Character',
      state: 'characters.create',
      roles: ['admin', 'consultant']
    });
  }
})();
