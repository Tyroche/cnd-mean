//Conversations service used to communicate Conversations REST endpoints
(function () {
  'use strict';

  angular
    .module('messages')
    .factory('ConversationsService', ConversationsService);

  ConversationsService.$inject = ['$resource'];

  function ConversationsService($resource) {
    return $resource('api/conversations/:conversationId', {
      conversationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
