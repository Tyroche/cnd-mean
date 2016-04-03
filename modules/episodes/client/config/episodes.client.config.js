(function () {
  'use strict';

  angular
    .module('episodes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'characters', {
      title: 'Episodes',
      state: 'episodes.list'
    });
  }
})();
