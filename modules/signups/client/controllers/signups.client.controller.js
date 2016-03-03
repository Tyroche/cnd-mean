(function() {
  'use strict';

  angular
    .module('signups')
    .controller('SignupsController', SignupsController);

  SignupsController.$inject = ['$scope'];

  function SignupsController($scope) {
    var vm = this;
    vm.sessions = [
        {title: "One" },
        {title: "Two" },
        {title: "Three" }
    ];
    // Signups controller logic
    // ...

    init();

    function init() {
    }
  }
})();
