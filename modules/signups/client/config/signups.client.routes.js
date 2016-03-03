(function () {
  'use strict';

  //Setting up route
  angular
    .module('signups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Signups state routing
    $stateProvider
      .state('master', {
        url: '/signup',
        templateUrl: 'modules/signups/client/views/master.client.view.html',
        controller: 'MasterController',
        controllerAs: 'vm'
      });
  }
})();
