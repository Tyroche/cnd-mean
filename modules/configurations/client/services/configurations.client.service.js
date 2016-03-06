//Configurations service used to communicate Configurations REST endpoints
(function () {
  'use strict';

  angular
    .module('configurations')
    .factory('ConfigurationsService', ConfigurationsService);

  ConfigurationsService.$inject = ['$resource'];

  function ConfigurationsService($resource) {
    return $resource('api/configurations/:configurationId', {
      configurationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
