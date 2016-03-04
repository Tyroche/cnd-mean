'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addSubMenuItem('topbar', 'characters', {
      title: 'Guild Chat',
      state: 'chat',
      roles: ['admin', 'user']
    });
  }
]);
