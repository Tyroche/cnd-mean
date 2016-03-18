//Feats service used to communicate Feats REST endpoints
(function () {
  'use strict';

  angular
    .module('feats')
    .factory('FeatsService', FeatsService);

  FeatsService.$inject = ['$resource'];

  function FeatsService($resource) {
    return $resource('api/feats/:featId', {
      featId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
