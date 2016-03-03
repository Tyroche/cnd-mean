//Episodes service used to communicate Episodes REST endpoints
(function () {
  'use strict';

  angular
    .module('episodes')
    .factory('EpisodesService', EpisodesService);

  EpisodesService.$inject = ['$resource'];

  function EpisodesService($resource) {
    return $resource('api/episodes/:episodeId', {
      episodeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
