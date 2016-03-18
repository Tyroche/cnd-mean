(function () {
  'use strict';

  angular
    .module('feats')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('feats', {
        abstract: true,
        url: '/feats',
        template: '<ui-view/>'
      })
      .state('feats.list', {
        url: '',
        templateUrl: 'modules/feats/client/views/list-feats.client.view.html',
        controller: 'FeatsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Feats List'
        }
      })
      .state('feats.create', {
        url: '/create',
        templateUrl: 'modules/feats/client/views/form-feat.client.view.html',
        controller: 'FeatsController',
        controllerAs: 'vm',
        resolve: {
          featResolve: newFeat
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Feats Create'
        }
      })
      .state('feats.edit', {
        url: '/:featId/edit',
        templateUrl: 'modules/feats/client/views/form-feat.client.view.html',
        controller: 'FeatsController',
        controllerAs: 'vm',
        resolve: {
          featResolve: getFeat
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Feat {{ featResolve.name }}'
        }
      })
      .state('feats.view', {
        url: '/:featId',
        templateUrl: 'modules/feats/client/views/view-feat.client.view.html',
        controller: 'FeatsController',
        controllerAs: 'vm',
        resolve: {
          featResolve: getFeat
        },
        data:{
          pageTitle: 'Feat {{ articleResolve.name }}'
        }
      });
  }

  getFeat.$inject = ['$stateParams', 'FeatsService'];

  function getFeat($stateParams, FeatsService) {
    return FeatsService.get({
      featId: $stateParams.featId
    }).$promise;
  }

  newFeat.$inject = ['FeatsService'];

  function newFeat(FeatsService) {
    return new FeatsService();
  }
})();
