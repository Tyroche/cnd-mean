(function () {
  'use strict';

  // Characters controller
  angular
    .module('characters')
    .controller('CharactersController', CharactersController);

  CharactersController.$inject = [
    '$scope',
    '$state',
    'Authentication',
    'characterResolve',
    'ConfigurationsService',
    'ItemsService'];

  function CharactersController ($scope, $state, Authentication, character, ConfigurationsService, itemsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.character = character;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.nextStep = nextStep;
    vm.previousStep = previousStep;
    vm.getClassDescription = getClassDescription;
    vm.getRaceDescription = getRaceDescription;
    vm.step = 0;

    ConfigurationsService.query({ enabled: true }, function(res) {
      if (!res[0]) {
        console.log('ERROR: No Configuration found!!!');
        return;
      }

      vm.config = res[0];
    });


    itemsService.query({ rarity: 'Common' }, function(res) {
      if (!res[0]) {
        console.log('ERROR: No Items found!!!');
        return;
      }

      vm.items = res;
      console.log(vm.items);
    });

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
      var maxStep = 5;
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

    function getRaceDescription() {
      // Check for missing config or missing classes
      if(!vm.config || !vm.config.races) {
        return;
      }

      // Filter through classes to find our selection
      var race = vm.config.races.filter(function(obj){
        return obj.name === vm.character.race;
      });

      // Return the description if a class existss
      if (race[0]) {
        return race[0].description;
      }
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

      if (!vm.character.player) {
        vm.character.player = Authentication.user;
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
