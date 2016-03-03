(function () {
  'use strict';

  //Setting up route
  angular
    .module('wiki')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Wiki state routing
    $stateProvider
      .state('wikimain', {
        url: '/wiki',
        templateUrl: 'modules/wiki/client/views/wikimain.client.view.html',
        controller: 'WikimainController',
        controllerAs: 'vm'
      });
  }
})();
