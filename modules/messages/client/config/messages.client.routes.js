(function () {
  'use strict';

  //Setting up route
  angular
    .module('messages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Messages state routing
    $stateProvider
      .state('conversations', {
        abstract: true,
        url: '/conversations',
        template: '<ui-view/>'
      })
      .state('conversations.list', {
        url: '/',
        templateUrl: 'modules/messages/client/views/list-conversations.client.view.html',
        controller: 'ConversationsController',
        controllerAs: 'vm'
      });
  }
})();
