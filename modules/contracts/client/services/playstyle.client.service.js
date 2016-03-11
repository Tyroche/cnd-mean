(function () {
  'use strict';

  angular
    .module('contracts')
    .service('PlaystyleContractService', PlaystyleContractService);

  PlaystyleContractService.$inject = [/*Example: '$state', '$window' */];

  function PlaystyleContractService(/*Example: $state, $window */) {
    // Playstyle service logic
    // ...

    // Public API
    return {

      addPlaystyle: function (contract) {
        if (!contract.expectedPlayStyles) {
          contract.expectedPlayStyles = [];
        }

        contract.expectedPlayStyles.push('');
      },

      removePlaystyle: function (contract, index) {
        contract.expectedPlayStyles.splice(index, 1);
      }
    };
  }
})();
