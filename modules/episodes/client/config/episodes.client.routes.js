(function () {
  'use strict';

  angular
    .module('episodes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('episodes', {
        abstract: true,
        url: '/episodes',
        template: '<ui-view/>'
      })
      .state('episodes.list', {
        url: '',
        templateUrl: 'modules/episodes/client/views/list-episodes.client.view.html',
        controller: 'EpisodesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Episodes List'
        }
      })
      .state('episodes.create', {
        url: '/create',
        templateUrl: 'modules/episodes/client/views/form-episode.client.view.html',
        controller: 'EpisodesController',
        controllerAs: 'vm',
        resolve: {
          episodeResolve: newEpisode
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Episodes Create'
        }
      })
      .state('episodes.edit', {
        url: '/:episodeId/edit',
        templateUrl: 'modules/episodes/client/views/form-episode.client.view.html',
        controller: 'EpisodesController',
        controllerAs: 'vm',
        resolve: {
          episodeResolve: getEpisode
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Episode {{ episodeResolve.name }}'
        }
      })
      .state('episodes.view', {
        url: '/:episodeId',
        templateUrl: 'modules/episodes/client/views/view-episode.client.view.html',
        controller: 'EpisodesController',
        controllerAs: 'vm',
        resolve: {
          episodeResolve: getEpisode
        },
        data:{
          pageTitle: 'Episode {{ articleResolve.name }}'
        }
      });
  }

  getEpisode.$inject = ['$stateParams', 'EpisodesService'];

  function getEpisode($stateParams, EpisodesService) {
    return EpisodesService.get({
      episodeId: $stateParams.episodeId
    }).$promise;
  }

  newEpisode.$inject = ['EpisodesService'];

  function newEpisode(EpisodesService) {
    return new EpisodesService();
  }
})();
