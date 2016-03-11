(function () {
  'use strict';

  angular
    .module('contracts')
    .factory('RewardsContractService', RewardsContractService);

  RewardsContractService.$inject = [/*Example: '$state', '$window' */];

  function RewardsContractService(/*Example: $state, $window */) {
    // Rewards service logic
    // ...

    // Public API
    return {
      addReward: function (contract) {
        if(!contract.rewards) {
          contract.rewards = [];
        }
        contract.rewards.push({});
      },

      removeReward: function (contract, index) {
        contract.rewards.splice(index, 1);
      }
    };
  }
})();
