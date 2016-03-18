(function () {
  'use strict';

  angular
    .module('backgrounds')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backgrounds', {
        abstract: true,
        url: '/backgrounds',
        template: '<ui-view/>'
      })
      .state('backgrounds.list', {
        url: '',
        templateUrl: 'modules/backgrounds/client/views/list-backgrounds.client.view.html',
        controller: 'BackgroundsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Backgrounds List'
        }
      })
      .state('backgrounds.create', {
        url: '/create',
        templateUrl: 'modules/backgrounds/client/views/form-background.client.view.html',
        controller: 'BackgroundsController',
        controllerAs: 'vm',
        resolve: {
          backgroundResolve: newBackground
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Backgrounds Create'
        }
      })
      .state('backgrounds.edit', {
        url: '/:backgroundId/edit',
        templateUrl: 'modules/backgrounds/client/views/form-background.client.view.html',
        controller: 'BackgroundsController',
        controllerAs: 'vm',
        resolve: {
          backgroundResolve: getBackground
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Background {{ backgroundResolve.name }}'
        }
      })
      .state('backgrounds.view', {
        url: '/:backgroundId',
        templateUrl: 'modules/backgrounds/client/views/view-background.client.view.html',
        controller: 'BackgroundsController',
        controllerAs: 'vm',
        resolve: {
          backgroundResolve: getBackground
        },
        data:{
          pageTitle: 'Background {{ articleResolve.name }}'
        }
      });
  }

  getBackground.$inject = ['$stateParams', 'BackgroundsService'];

  function getBackground($stateParams, BackgroundsService) {
    return BackgroundsService.get({
      backgroundId: $stateParams.backgroundId
    }).$promise;
  }

  newBackground.$inject = ['BackgroundsService'];

  function newBackground(BackgroundsService) {
    return new BackgroundsService();
  }
})();
