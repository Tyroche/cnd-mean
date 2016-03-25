(function () {
  'use strict';

  angular
    .module('core')
    .directive('intTuner', intTuner);

  intTuner.$inject = [/*Example: '$state', '$window' */];

  function intTuner(/*Example: $state, $window */) {
    var controller = function($scope) {
      var vm = this;
      vm.tunerValue = $scope.tunerValue;
      vm.min = parseInt($scope.min);
      vm.max = parseInt($scope.max);
      vm.adjust = adjust;

      function adjust(by) {
        vm.tunerValue += parseInt(by);
        console.log(vm.tunerValue);
      }
    };

    return {
      templateUrl: 'modules/core/client/views/directives/int-tuner.view.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        tunerValue: '=',
        min: '@',
        max: '@'
      }
    };
  }
})();
