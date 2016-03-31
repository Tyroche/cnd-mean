(function() {
  'use strict';

  angular
    .module('characters')
    .controller('LevelUpController', LevelUpController);

  LevelUpController.$inject = [
    '$scope',
    '$location',
    'characterResolve'
  ];

  function LevelUpController($scope, $location, character) {
    var vm = this;
    vm.character = character;

    // Calculates the ACTUAL character level
    vm.totalCharacterLevel = totalCharacterLevel;
    function totalCharacterLevel() {
      return vm.character.playableClass.reduce(function(curr, prof){
        return curr + prof.level;
      }, 0);
    }

    init();
    function init() {
      if(vm.character.level <= totalCharacterLevel()) {
          $location.path('characters/' + vm.character._id);
      }
    }
  }
})();
