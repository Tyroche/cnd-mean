//Races service used to communicate Races REST endpoints
(function () {
  'use strict';

  angular
    .module('races')
    .factory('RacesService', RacesService);

  RacesService.$inject = ['$resource'];

  function RacesService($resource) {
    return $resource('api/races/:raceId', {
      raceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
