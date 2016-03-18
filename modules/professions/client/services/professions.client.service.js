//Professions service used to communicate Professions REST endpoints
(function () {
  'use strict';

  angular
    .module('professions')
    .factory('ProfessionsService', ProfessionsService);

  ProfessionsService.$inject = ['$resource'];

  function ProfessionsService($resource) {
    return $resource('api/professions/:professionId', {
      professionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
