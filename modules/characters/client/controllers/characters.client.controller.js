(function () {
  'use strict';

  // Characters controller
  angular
    .module('characters')
    .controller('CharactersController', CharactersController);

  CharactersController.$inject = ['$scope', '$state', 'Authentication', 'characterResolve', 'ConfigurationsService'];

  function CharactersController ($scope, $state, Authentication, character, ConfigurationsService) {
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
    vm.getClassDescription = getClassDescription;
    vm.step = 0;

    ConfigurationsService.query({ enabled: true }, function(resp) {
      if(!resp[0]) {
        console.log('ERROR: No Configuration found!!!');
        return;
      }

      vm.config = resp[0];
    });

    // Playable Races
    vm.races = [
      { race: 'human', name: 'Human', description: "" },
      { race: 'half-elf', name: 'Half Elf', description: "" },
      { race: 'elf', name: 'Elf', description: "" },
      { race: 'dwarf', name: 'Dwarf', description: "" },
      { race: 'gnome', name: 'Gnome', description: "" },
      { race: 'aarakocra', name: 'Aarakocra', description: "" },
      { race: 'half-orc', name: 'Half Orc', description: "" },
      { race: 'dragonborn', name: 'Erukan (Dragonborn)', description: "" },
      { race: 'titan', name: 'Galadrast (Titan)', description: "" }
    ];

    vm.creationSteps = [
      {
        title: 'Basics',
        template: 'modules/characters/client/views/creationSteps/character.creation.basics.view.html',
        help:'modules/characters/client/views/creationHelp/character.creation.basics.help.view.html'
      },
      {
        title: 'Attributes',
        template: 'modules/characters/client/views/creationSteps/character.creation.attributes.view.html' ,
        help:'modules/characters/client/views/creationHelp/character.creation.attributes.help.view.html'
      },
      {
        title: 'Background',
        template: 'modules/characters/client/views/creationSteps/character.creation.background.view.html' ,
        help:'modules/characters/client/views/creationHelp/character.creation.background.help.view.html'
      },
      {
        title: 'Inventory',
        template: 'modules/characters/client/views/creationSteps/character.creation.inventory.view.html' ,
        help:'modules/characters/client/views/creationHelp/character.creation.inventory.help.view.html'
      },
      {
        title: 'Spells',
        template: 'modules/characters/client/views/creationSteps/character.creation.spells.view.html',
        help:'modules/characters/client/views/creationHelp/character.creation.spells.help.view.html'
      }
    ];

    function nextStep() {
      var maxStep = 4;
      if(isSpellCaster()) {
        maxStep = 5;
      }
      vm.step = Math.min(maxStep, vm.step + 1);
    }

    function previousStep() {
      vm.step = Math.max(0, vm.step - 1);
    }

    function getClassDescription() {
      // Check for missing config or missing classes
      if(!vm.config || !vm.config.classes) {
        return;
      }

      // Filter through classes to find our selection
      var playableClass = vm.config.classes.filter(function(obj){
        return obj.name === vm.character.playableClass;
      });

      // Return the description if a class existss
      if (playableClass[0]) {
        return playableClass[0].description;
      }
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
