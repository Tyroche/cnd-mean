'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Configuration',
      state: 'admin',
      type: 'dropdown',
      position: 4,
      roles: ['admin']
    });
  }
]);
