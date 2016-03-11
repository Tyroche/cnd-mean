(function () {
  'use strict';

  angular
    .module('contracts')
    .factory('ContractsVotingService', ContractsVotingService);

  ContractsVotingService.$inject = [/*Example: '$state', '$window' */];

  function ContractsVotingService(/*Example: $state, $window */) {
    // Voting service logic
    // ...

    // Public API
    return {
      voteFor: function () {
        return true;
      }
    };
  }
})();
