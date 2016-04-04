(function () {
  'use strict';

  angular
    .module('core')
    .directive('informationSummary', informationSummary);

  //informationSummary.$inject = [];

  function informationSummary() {
    var controller = function($scope) {
      var vm = this;

      init();
      function init() {
        if($scope.user) {
          vm.user = JSON.parse($scope.user);
        }
      }
    };

    return {
      templateUrl: 'modules/core/client/views/directives/information-summary.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        user: '@'
      }
    };
  }
})();
