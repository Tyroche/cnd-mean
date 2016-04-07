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
      title: 'Characters',
      state: 'characters.list'
    });
  }
})();
