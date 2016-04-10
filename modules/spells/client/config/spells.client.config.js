(function () {
  'use strict';

  angular
    .module('spells')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Spells',
      state: 'spells.list'
    });
  }
})();
