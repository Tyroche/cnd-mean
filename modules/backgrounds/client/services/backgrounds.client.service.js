//Backgrounds service used to communicate Backgrounds REST endpoints
(function () {
  'use strict';

  angular
    .module('backgrounds')
    .factory('BackgroundsService', BackgroundsService);

  BackgroundsService.$inject = ['$resource'];

  function BackgroundsService($resource) {
    return $resource('api/backgrounds/:backgroundId', {
      backgroundId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
