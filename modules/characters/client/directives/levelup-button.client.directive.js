(function () {
  'use strict';

  angular
    .module('characters')
    .directive('levelUpButton', levelUpButton);

  //levelUpButton.$inject = [];

  function levelUpButton() {
    var controller = function($scope) {
      var vm = this;
      vm.level = parseInt($scope.level);
      vm.professions = JSON.parse($scope.professions);
      vm.characterId = $scope.character;
      vm.totalLevel = -1;
      vm.hasLevelUp = hasLevelUp;

      console.log(getTotalCharacterLevel());

      function hasLevelUp() {
        return vm.level > getTotalCharacterLevel();
      }

      function getTotalCharacterLevel() {
        return vm.professions.reduce(function(cur, next) {
          return cur + next.level;
        }, 0);
      }
    };

    return {
      templateUrl: 'modules/characters/client/views/directives/level-up-button.view.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        level: '@',
        professions: '@',
        character: '@'
      }
    };
  }
})();
