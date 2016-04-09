(function () {
  'use strict';

  angular
    .module('characters')
    .directive('spellcastingPanel', spellcastingPanel);

  spellcastingPanel.$inject = [/*Example: '$state', '$window' */];

  function spellcastingPanel(/*Example: $state, $window */) {
    var controller = function($scope) {
      var vm = this;

      vm.isSpellCaster = isSpellCaster;
      function isSpellCaster() {
        return vm.archetype;
      }

      vm.spellSaveDC = spellSaveDC;
      function spellSaveDC() {
        return 8 + vm.proficiencyBonus + toModifier(vm.stats[vm.archetype.spellcasting.ability]);
      }

      vm.attackRollMod = attackRollMod;
      function attackRollMod() {
        return vm.proficiencyBonus + toModifier(vm.stats[vm.archetype.spellcasting.ability]);
      }

      // Stat to modifier
      function toModifier(attVal) {
        return Math.floor((attVal-10) / 2);
      }

      // Find the most relevant archetype to base everything from
      function determineSpellcastingArchetype() {
        // Always check Universal
        var possibilities = [vm.professions[0].profession.archetypes[0]];

        // If we have already selected an archetype, check that one too
        if(vm.professions[0].level >= vm.professions[0].profession.archetypeLevelRequirement) {
          possibilities.push(vm.professions[0].profession.archetypes[vm.professions[0].archetype]);
        }

        // Find the most relevant archetype to be basing everything off of
        possibilities.forEach(function (archetype) {
          if (archetype.spellcasting && archetype.spellcasting.isSpellCaster) {
            vm.archetype = archetype;
            return;
          }
        });
      }

      init();
      function init() {
        vm.professions = JSON.parse($scope.professions);
        vm.stats = JSON.parse($scope.stats);
        vm.proficiencyBonus = 2 + Math.floor(vm.professions[0].level / 4);

        //vm.spellcasterArchetype =
        determineSpellcastingArchetype();
      }
    };

    return {
      templateUrl: 'modules/characters/client/views/directives/spellcasting-panel.view.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        professions: '@',
        stats: '@'
      }
    };
  }
})();
