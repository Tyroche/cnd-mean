'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Media',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Local News',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create News Article',
      state: 'articles.create',
      roles: ['admin']
    });
  }
]);
