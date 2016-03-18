(function() {
  'use strict';

  angular
    .module('backgrounds')
    .controller('BackgroundsCreateController', BackgroundsCreateController);

  BackgroundsCreateController.$inject = ['$scope'];

  function BackgroundsCreateController($scope) {
    var vm = this;

    // Backgrounds create controller logic
    // ...

    init();

    function init() {
    }
  }
})();
