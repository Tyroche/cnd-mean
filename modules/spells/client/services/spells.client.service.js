//Spells service used to communicate Spells REST endpoints
(function () {
  'use strict';

  angular
    .module('spells')
    .factory('SpellsService', SpellsService);

  SpellsService.$inject = ['$resource'];

  function SpellsService($resource) {
    return $resource('api/spells/:spellId', {
      spellId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
