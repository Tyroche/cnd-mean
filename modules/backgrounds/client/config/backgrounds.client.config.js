(function () {
  'use strict';

  angular
    .module('backgrounds')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'configurations', {
      title: 'Manage Backgrounds',
      state: 'backgrounds.list'
    });
  }
})();
