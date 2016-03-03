'use strict';

// Configuring the Chat module
angular.module('signups').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Signups',
      state: 'signups'
    });
  }
]);
