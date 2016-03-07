(function () {
  'use strict';

  angular
    .module('configurations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('configurations', {
        abstract: true,
        url: '/configurations',
        template: '<ui-view/>'
      })
      .state('configurations.list', {
        url: '',
        templateUrl: 'modules/configurations/client/views/list-configurations.client.view.html',
        controller: 'ConfigurationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Configurations List'
        }
      })
      .state('configurations.create', {
        url: '/create',
        templateUrl: 'modules/configurations/client/views/form-configuration.client.view.html',
        controller: 'ConfigurationsController',
        controllerAs: 'vm',
        resolve: {
          configurationResolve: newConfiguration
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Configurations Create'
        }
      })
      .state('configurations.edit', {
        url: '/:configurationId/edit',
        templateUrl: 'modules/configurations/client/views/form-configuration.client.view.html',
        controller: 'ConfigurationsController',
        controllerAs: 'vm',
        resolve: {
          configurationResolve: getConfiguration
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Configuration {{ configurationResolve.name }}'
        }
      })
      .state('configurations.edit.basics', {
        url: '/basics',
        templateUrl: 'modules/configurations/client/views/form-configuration-basics.client.view.html'
      })
      .state('configurations.edit.races', {
        url: '/races',
        templateUrl: 'modules/configurations/client/views/form-configuration-races.client.view.html'
      })
      .state('configurations.edit.classes', {
        url: '/classes',
        templateUrl: 'modules/configurations/client/views/form-configuration-classes.client.view.html'
      })
      .state('configurations.create.basics', {
        url: '/basics',
        templateUrl: 'modules/configurations/client/views/form-configuration-basics.client.view.html'
      })
      .state('configurations.create.races', {
        url: '/races',
        templateUrl: 'modules/configurations/client/views/form-configuration-races.client.view.html'
      })
      .state('configurations.create.classes', {
        url: '/classes',
        templateUrl: 'modules/configurations/client/views/form-configuration-classes.client.view.html'
      })
      .state('configurations.view', {
        url: '/:configurationId',
        templateUrl: 'modules/configurations/client/views/view-configuration.client.view.html',
        controller: 'ConfigurationsController',
        controllerAs: 'vm',
        resolve: {
          configurationResolve: getConfiguration
        },
        data:{
          pageTitle: 'Configuration {{ articleResolve.name }}'
        }
      });
  }

  getConfiguration.$inject = ['$stateParams', 'ConfigurationsService'];

  function getConfiguration($stateParams, ConfigurationsService) {
    return ConfigurationsService.get({
      configurationId: $stateParams.configurationId
    }).$promise;
  }

  newConfiguration.$inject = ['ConfigurationsService'];

  function newConfiguration(ConfigurationsService) {
    return new ConfigurationsService();
  }
})();
