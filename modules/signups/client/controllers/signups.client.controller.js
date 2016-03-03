(function() {
  'use strict';

  angular
    .module('signups')
    .controller('SignupsController', SignupsController);

  SignupsController.$inject = ['$scope'];

  function SignupsController($scope) {
    var vm = this;

    // Signups controller logic
    // ...

    init();

    function init() {
    }
  }
})();
