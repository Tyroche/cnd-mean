(function () {
  'use strict';

  angular
    .module('wikis')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Tolmea Wiki',
      state: 'wikis.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Wiki Entry',
      state: 'wikis.create',
      roles: ['admin']
    });
  }
})();
