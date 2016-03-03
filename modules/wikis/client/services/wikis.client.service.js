//Wikis service used to communicate Wikis REST endpoints
(function () {
  'use strict';

  angular
    .module('wikis')
    .factory('WikisService', WikisService);

  WikisService.$inject = ['$resource'];

  function WikisService($resource) {
    return $resource('api/wikis/:wikiId', {
      wikiId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
