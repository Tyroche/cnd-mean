(function () {
  'use strict';

  angular
    .module('races')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'configurations', {
      title: 'Manage Races',
      state: 'races.list'
    });
  }
})();
