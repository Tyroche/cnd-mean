(function() {
  'use strict';

  angular
    .module('characters')
    .controller('LevelUpController', LevelUpController);

  LevelUpController.$inject = [
    '$scope',
    '$location',
    'characterResolve',
    'Dataloader'
  ];

  function LevelUpController($scope, $location, character, dataloader) {
    var vm = this;
    vm.character = character;
    vm.chosenArchetype = undefined;
    vm.chosenProfession = undefined;
    vm.hitDieLock = false;

    // Calculates the ACTUAL character level
    vm.totalCharacterLevel = totalCharacterLevel;
    function totalCharacterLevel() {
      return vm.character.playableClass.reduce(function(curr, prof){
        return curr + prof.level;
      }, 0);
    }

    // Get constitution mod
    vm.constitutionModifier = constitutionModifier;
    function constitutionModifier() {
      return Math.floor((vm.character.attributes.Constitution-10) / 2);
    }

    // Randomizes the player's hitpoints
    vm.rollHitDie = rollHitDie;
    function rollHitDie() {
      if (vm.chosenProfession && !vm.hitDieLock) {
        var roll = Math.max(1, Math.ceil(Math.random()*vm.chosenProfession.hitDice) + constitutionModifier());
        console.log('Rolled a '+ roll);
        vm.character.hitpoints += roll;
        finalize();
      }
    }

    // Randomizes the player's hitpoints
    vm.takeAverageHitDie = takeAverageHitDie;
    function takeAverageHitDie() {
      if (vm.chosenProfession) {
        vm.character.hitpoints += Math.max(1, Math.ceil(vm.chosenProfession.hitDice/2) + constitutionModifier());
        finalize();
      }
    }

    function finalize() {
      vm.hitDieLock = true;
      var foundClass = vm.character.playableClass.filter(function(prof){
        return prof.profession._id === vm.chosenProfession._id;
      })[0];

      if(foundClass) {
        var ind = vm.character.playableClass.indexOf(foundClass);
        vm.character.playableClass[ind].level += 1;
        vm.character.playableClass[ind].archetype = vm.chosenArchetype;
        vm.character.$update();
        return;
      }

      vm.character.playableClass.push({
        profession: vm.chosenProfession,
        level: 1,
        archetype: vm.chosenArchetype
      });
      vm.character.$update();
    }

    // Get the level the user would have in a given profession
    vm.getProfessionLevel = getProfessionLevel;
    function getProfessionLevel() {
      var foundClass = vm.character.playableClass.filter(function(el){
        return el.profession._id === vm.chosenProfession._id;
      })[0];

      return foundClass ? foundClass.level + 1 : 1;
    }

    init();
    function init() {
      vm.canLevel = vm.character.level > vm.totalCharacterLevel();
      if(vm.character.level <= totalCharacterLevel()) {
          $location.path('characters/' + vm.character._id);
          return;
      }

      vm.preLevel = vm.totalCharacterLevel();
      vm.loadedData = dataloader.loadClasses();
    }
  }
})();
