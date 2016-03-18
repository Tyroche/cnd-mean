(function () {
  'use strict';

  // Professions controller
  angular
    .module('professions')
    .controller('ProfessionsController', ProfessionsController);

  ProfessionsController.$inject = ['$scope', '$state', 'Authentication', 'professionResolve'];

  function ProfessionsController ($scope, $state, Authentication, profession) {
    var vm = this;

    vm.authentication = Authentication;
    vm.profession = profession;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addSaveProficiency = addSaveProficiency;
    vm.addSkill = addSkill;

    vm.abilitySaves = [
      'Strength',
      'Dexterity',
      'Constitution',
      'Intelligence',
      'Wisdom',
      'Charisma'
    ];

    vm.skillsAvailable = [
      'Athletics',
      'Acrobatics',
      'Sleight of Hand',
      'Stealth',
      'Arcana',
      'History',
      'Investigation',
      'Nature',
      'Religion',
      'Animal Handling',
      'Insight',
      'Medicine',
      'Perception',
      'Survival',
      'Deception',
      'Intimidation',
      'Perform',
      'Persuasion'
    ];

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
