(function() {
  'use strict';

  angular
    .module('messages')
    .controller('ConversationsController', ConversationsController);

  ConversationsController.$inject = [
    '$scope',
    '$resource',
    '$filter'
  ];

  function ConversationsController($scope, $resource, $filter) {
    var vm = this;

    init();
    function init() {
      // Get the conversations by calling api/conversations
      vm.conversations = $resource('api/conversations').query({}, function(res) {
        return res;
      });

      vm.players = $resource('api/users').query({}, function(res) {
        return res.filter(function(result) {
          if (result.roles.indexOf('admin') > -1){
            result.qualifier = '(GM) ';
            return true;
          }
          result.qualifier = '';
          return result.roles.indexOf('consultant') > -1;
        });
      });
    }
  }
})();
