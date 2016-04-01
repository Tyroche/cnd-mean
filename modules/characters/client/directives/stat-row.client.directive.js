(function () {
  'use strict';

  angular
    .module('characters')
    .directive('statRow', statRow);

  function statRow() {
    var controller = function($scope) {
      var vm = this;
      vm.attributeType = $scope.attribute;
      vm.character = $scope.character;

      init();
      function init() {
        vm.atttributeRawValue = vm.character.attributes[vm.attributeType];
      }
    };

    return {
      templateUrl: 'modules/characters/client/views/directives/stat-row-view.client.view.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        attribute: '@',
        character: '='
      },
      restrict: 'EA'
    };
  }
})();
