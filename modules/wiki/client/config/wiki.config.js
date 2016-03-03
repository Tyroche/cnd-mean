'use strict';

// Configuring the Chat module
angular.module('wiki').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Wiki',
      state: 'wikimain'
    });
  }
]);
