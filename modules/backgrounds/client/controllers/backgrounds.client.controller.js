(function () {
  'use strict';

  // Backgrounds controller
  angular
    .module('backgrounds')
    .controller('BackgroundsController', BackgroundsController);

  BackgroundsController.$inject = ['$scope', '$state', 'Authentication', 'backgroundResolve'];

  function BackgroundsController ($scope, $state, Authentication, background) {
    var vm = this;

    vm.authentication = Authentication;
    vm.background = background;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.removeSkillProficiency = removeSkillProficiency;
    vm.addSkill = addSkill;

    vm.skillsAvailable = [
      'Acrobatics',
      'Animal Handling',
      'Arcana',
      'Athletics',
      'Deception',
      'History',
      'Medicine',
      'Insight',
      'Intimidation',
      'Investigation',
      'Nature',
      'Perception',
      'Perform',
      'Persuasion',
      'Religion',
      'Sleight of Hand',
      'Stealth',
      'Survival'
    ];

    function init() {
      if (!vm.background._id) {
        vm.background.traits = [];
        vm.background.ideals = [];
        vm.background.bonds = [];
        vm.background.flaws = [];
      }
    }

    function removeSkillProficiency(skill) {
      var ind = vm.background.skillProficiencies.indexOf(skill);
      vm.background.skillProficiencies.splice(ind, 1);
    }

    function addSkill(skill) {
      if(!vm.background.skillProficiencies) { vm.background.skillProficiencies = []; }
      if(!vm.background.skillProficiencies.some(function (s) { return s === skill; })) {
        vm.background.skillProficiencies.push(skill);
      }
    }

    // Remove existing Background
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.background.$remove($state.go('backgrounds.list'));
      }
    }

    // Save Background
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.backgroundForm');
        return false;
      }

      console.log(vm.background);

      // TODO: move create/update logic to service
      if (vm.background._id) {
        vm.background.$update(successCallback, errorCallback);
      } else {
        vm.background.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('backgrounds.view', {
          backgroundId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    init();
  }
})();
