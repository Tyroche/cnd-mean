(function () {
  'use strict';

  angular
    .module('characters')
    .directive('skillsDisplay', skillsDisplay);

  skillsDisplay.$inject = ['CharacterSourceService'];

  function skillsDisplay(sourceService) {
    var controller = function($scope) {
      var vm = this;
      vm.canSelect = $scope.canSelect;
      vm.character = $scope.character;
      vm.skills = sourceService.getSkills();

      vm.toggleProficiency = toggleProficiency;
      vm.numberProficiencies = numberProficiencies;
      vm.getSkillMod = getSkillMod;
      vm.getSaveMod = getSaveMod;
      vm.getMod = getMod;

      function getMod(attribute) {
        return toMod(vm.character.attributes[attribute]);
      }

      function getSaveMod(attribute) {
        var mod = toMod(vm.character.attributes[attribute]);
        if(vm.character.playableClass[0].profession.saveProficiencies.indexOf(attribute) > -1) {
          return getProficiency() + mod;
        }
        return mod;
      }

      function getSkillMod(skill, attribute) {
        var mod = toMod(vm.character.attributes[attribute]);
        if(vm.character.skills.indexOf(skill) > -1 || vm.character.background.generalization.skillProficiencies.indexOf(skill) > -1) {
          return getProficiency() + mod;
        }
        return mod;
      }

      function numberProficiencies() {
        return parseInt(vm.character.playableClass[0].profession.numSkillProficiencies) + parseInt(vm.character.race.numSkillProficiencies);
      }

      function toggleProficiency(skill) {
        var skillIndex = vm.character.skills.indexOf(skill);
        if(skillIndex > -1) {
          vm.character.skills.splice(skillIndex, 1);
          return;
        }
        vm.character.skills.push(skill);
      }

      // Statics
      function getProficiency() {
        return 2;
      }

      function toMod(attVal) {
        return Math.floor((attVal-10) / 2);
      }
    };

    return {
      templateUrl: 'modules/characters/client/views/directives/skills-display.view.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        character: '=',
        canSelect: '='
      }
    };
  }
})();
