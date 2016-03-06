(function () {
  'use strict';

  angular
    .module('episodes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'episodes', {
      title: 'List Episodes',
      state: 'episodes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'episodes', {
      title: 'Create Episode',
      state: 'episodes.create',
      roles: ['admin']
    });
  }
})();
