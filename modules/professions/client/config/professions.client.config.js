(function () {
  'use strict';

  angular
    .module('professions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Classes',
      state: 'professions.list'
    });
  }
})();
