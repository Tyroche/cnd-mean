(function () {
  'use strict';

  // Characters controller
  angular
    .module('characters')
    .controller('CharactersController', CharactersController);

  CharactersController.$inject = ['$scope', '$state', 'Authentication', 'characterResolve'];

  function CharactersController ($scope, $state, Authentication, character) {
    var vm = this;

    vm.authentication = Authentication;
    vm.character = character;
    vm.error = null;
    vm.form = {};
    vm.isSpellCaster = isSpellCaster;
    vm.remove = remove;
    vm.save = save;
    vm.nextStep = nextStep;
    vm.previousStep = previousStep;
    vm.step = 0;

    // Playable classes
    vm.classes = [
      'Barbarian',
      'Bard',
      'Cleric',
      'Druid',
      'Fighter',
      'Monk',
      'Paladin',
      'Ranger',
      'Rogue',
      'Sorcerer',
      'Warlock',
      'Wizard'
    ];

    // Playable Races
    vm.races = [
      { race: 'human', description: 'Human' },
      { race: 'halfelf', description: 'Half Elf' },
      { race: 'elf', description: 'Elf' },
      { race: 'dwarf', description: 'Dwarf' },
      { race: 'gnome', description: 'Gnome' },
      { race: 'birdman', description: 'Aarakocra' },
      { race: 'halforc', description: 'Half Orc' },
      { race: 'dragonborn', description: 'Erukan (Dragonborn)' },
      { race: 'titan', description: 'Galadrast (Titan)' }
    ];

    function nextStep() {
      var maxStep = 4;
      if(isSpellCaster()) {
        maxStep = 5;
      }
      vm.step = Math.min(maxStep, vm.step + 1);
      console.log(vm.step);
    }

    function previousStep() {
      vm.step = Math.max(0, vm.step - 1);
      console.log(vm.step);
    }

    function isSpellCaster() {
      var c = vm.character.playableClass;
      var casters = [
        'Bard',
        'Cleric',
        'Druid',
        'Paladin',
        'Ranger',
        'Sorcerer',
        'Warlock',
        'Wizard'
      ];

      // Need to set up an api or something to do this more nicely
      return c && casters.indexOf(c) > -1;
    }

    // Remove existing Character
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.character.$remove($state.go('characters.list'));
      }
    }

    // Save Character
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.characterForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.character._id) {
        vm.character.$update(successCallback, errorCallback);
      } else {
        vm.character.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('characters.view', {
          characterId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
