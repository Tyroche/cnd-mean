(function () {
  'use strict';

  angular
    .module('wikis')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('wikis', {
        abstract: true,
        url: '/wikis',
        template: '<ui-view/>'
      })
      .state('wikis.list', {
        url: '',
        templateUrl: 'modules/wikis/client/views/list-wikis.client.view.html',
        controller: 'WikisListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Wikis List'
        }
      })
      .state('wikis.create', {
        url: '/create',
        templateUrl: 'modules/wikis/client/views/form-wiki.client.view.html',
        controller: 'WikisController',
        controllerAs: 'vm',
        resolve: {
          wikiResolve: newWiki
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Wikis Create'
        }
      })
      .state('wikis.edit', {
        url: '/:wikiId/edit',
        templateUrl: 'modules/wikis/client/views/form-wiki.client.view.html',
        controller: 'WikisController',
        controllerAs: 'vm',
        resolve: {
          wikiResolve: getWiki
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Wiki {{ wikiResolve.name }}'
        }
      })
      .state('wikis.view', {
        url: '/:wikiId',
        templateUrl: 'modules/wikis/client/views/view-wiki.client.view.html',
        controller: 'WikisController',
        controllerAs: 'vm',
        resolve: {
          wikiResolve: getWiki
        },
        data:{
          pageTitle: 'Wiki {{ articleResolve.name }}'
        }
      });
  }

  getWiki.$inject = ['$stateParams', 'WikisService'];

  function getWiki($stateParams, WikisService) {
    return WikisService.get({
      wikiId: $stateParams.wikiId
    }).$promise;
  }

  newWiki.$inject = ['WikisService'];

  function newWiki(WikisService) {
    return new WikisService();
  }
})();
