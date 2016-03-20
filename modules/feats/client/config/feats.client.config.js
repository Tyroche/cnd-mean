(function () {
  'use strict';

  angular
    .module('feats')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Feats',
      state: 'feats.list'
    });
  }
})();
