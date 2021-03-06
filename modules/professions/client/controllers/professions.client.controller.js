(function () {
  'use strict';

  // Professions controller
  angular
    .module('professions')
    .controller('ProfessionsController', ProfessionsController);

  ProfessionsController.$inject = ['$scope', '$state', '$resource', 'Authentication', 'professionResolve'];

  function ProfessionsController ($scope, $state, $resource, Authentication, profession) {
    var vm = this;

    vm.authentication = Authentication;
    vm.profession = profession;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addSaveProficiency = addSaveProficiency;
    vm.removeSaveProficiency = removeSaveProficiency;
    vm.addSkill = addSkill;
    vm.removeSkillProficiency = removeSkillProficiency;

    vm.abilitySaves = [
      'Strength',
      'Dexterity',
      'Constitution',
      'Intelligence',
      'Wisdom',
      'Charisma'
    ];

    vm.skillsAvailable = [
      'Acrobatics',
      'Animal Handling',
      'Arcana',
      'Athletics',
      'Deception',
      'History',
      'Insight',
      'Intimidation',
      'Investigation',
      'Medicine',
      'Nature',
      'Perception',
      'Perform',
      'Persuasion',
      'Religion',
      'Sleight of Hand',
      'Stealth',
      'Survival'
    ];

    init();
    function init() {
      if (!vm.profession._id || vm.profession.id && vm.profession.archetypes.length === 0) {
        vm.profession.archetypes.push({
          title: 'Universal',
          description: 'The generic archetype; all archetypes benefit from traits here.'
        });
      }
      if (!vm.profession._id) {
        vm.profession.numSkillProficiencies = 2;
        vm.profession.archetypeLevelRequirement = 3;
      }
    }

    function removeSaveProficiency(save) {
      var ind = vm.profession.saveProficiencies.indexOf(save);
      vm.profession.saveProficiencies.splice(ind, 1);
    }
    function removeSkillProficiency(skill) {
      var ind = vm.profession.skillProficiencies.indexOf(skill);
      vm.profession.skillProficiencies.splice(ind, 1);
    }

    function addSaveProficiency(save) {
      if(!vm.profession.saveProficiencies) { vm.profession.saveProficiencies = []; }
      if(!vm.profession.saveProficiencies.some(function (s) { return s === save; })) {
        vm.profession.saveProficiencies.push(save);
      }
    }

    function addSkill(skill) {
      if(!vm.profession.skillProficiencies) { vm.profession.skillProficiencies = []; }
      if(!vm.profession.skillProficiencies.some(function (s) { return s === skill; })) {
        vm.profession.skillProficiencies.push(skill);
      }
    }

    // Remove existing Profession
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.profession.$remove($state.go('professions.list'));
      }
    }

    // Save Profession
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.professionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.profession._id) {
        vm.profession.$update(successCallback, errorCallback);
      } else {
        vm.profession.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('professions.view', {
          professionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
