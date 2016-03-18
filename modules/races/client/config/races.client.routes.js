(function () {
  'use strict';

  angular
    .module('races')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('create', {
        url: '/create',
        templateUrl: 'modules/races/client/views/create.client.view.html',
        controller: 'CreateController',
        controllerAs: 'vm'
      })
      .state('races', {
        abstract: true,
        url: '/races',
        template: '<ui-view/>'
      })
      .state('races.list', {
        url: '',
        templateUrl: 'modules/races/client/views/list-races.client.view.html',
        controller: 'RacesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Races List'
        }
      })
      .state('races.create', {
        url: '/create',
        templateUrl: 'modules/races/client/views/form-race.client.view.html',
        controller: 'RacesController',
        controllerAs: 'vm',
        resolve: {
          raceResolve: newRace
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Races Create'
        }
      })
      .state('races.edit', {
        url: '/:raceId/edit',
        templateUrl: 'modules/races/client/views/form-race.client.view.html',
        controller: 'RacesController',
        controllerAs: 'vm',
        resolve: {
          raceResolve: getRace
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Race {{ raceResolve.name }}'
        }
      })
      .state('races.view', {
        url: '/:raceId',
        templateUrl: 'modules/races/client/views/view-race.client.view.html',
        controller: 'RacesController',
        controllerAs: 'vm',
        resolve: {
          raceResolve: getRace
        },
        data:{
          pageTitle: 'Race {{ articleResolve.name }}'
        }
      });
  }

  getRace.$inject = ['$stateParams', 'RacesService'];

  function getRace($stateParams, RacesService) {
    return RacesService.get({
      raceId: $stateParams.raceId
    }).$promise;
  }

  newRace.$inject = ['RacesService'];

  function newRace(RacesService) {
    return new RacesService();
  }
})();
