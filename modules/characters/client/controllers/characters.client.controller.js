(function () {
  'use strict';

  // Characters controller
  angular
    .module('characters')
    .controller('CharactersController', CharactersController);

  CharactersController.$inject = [
    '$scope',
    '$state',
    '$resource',
    'Authentication',
    'characterResolve',
    'CharacterSourceService',
    'Dataloader'];

  function CharactersController ($scope, $state, $resource, Authentication, character, characterSources, dataLoader) {
    var vm = this;

    vm.authentication = Authentication;
    vm.character = character;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.step = 0;
    vm.loadedData = {};
    vm.nextStep = nextStep;
    vm.previousStep = previousStep;

    vm.points = 27;
    vm.removePoint = removePoint;
    vm.addPoint = addPoint;
    vm.getActualValue = getActualValue;
    vm.toModifier = toModifier;
    vm.toModifierRaw = toModifierRaw;
    vm.getSaveMod = getSaveMod;
    vm.randomizeBackground = randomizeBackground;
    init();

    function init() {
      vm.loadedData = dataLoader.loadData(vm.character, Authentication.user);
      vm.skills = characterSources.getSkills();
      vm.creationSteps = characterSources.getSteps();
      vm.racialBonus = '';

      // No need to do anything for Character Sheet
      if($state.current.name === 'characters.view') {
        return;
      }

      // If editing, set the points (PBuy) to the appropriate values
      if(vm.character._id) {
        for (var attr in vm.character.attributes) {
          var rawVal = vm.character.attributes[attr] - vm.character.race.abilityIncreases[attr];
          vm.character.attributes[attr] = rawVal;
          vm.points -= getPointCost(rawVal);
        }
        return;
      }

      // Character creation, default everything
      vm.character.attributes = {
        Strength: 8,
        Dexterity: 8,
        Constitution: 8,
        Intelligence: 8,
        Wisdom: 8,
        Charisma: 8
      };
      vm.character.funds = 100;
      vm.character.skills = [];
      vm.character.playableClass = [{
        profession: undefined,
        level: 1
      }];
      vm.character.items = [];
      vm.character.background = {};
    }

    function randomizeBackground(type) {
      if(!vm.character.background.generalization) { return 'Can\'t randomize'; }
      var backgroundType = vm.character.background.generalization[type + 's'];
      var choice = Math.floor(Math.random() * backgroundType.length);
      vm.character.background[type] = backgroundType[choice];
    }

    function getProficiency() {
      return 2;
    }

    function getPointCost(val) {
      return Math.max(0, (val-13)) + Math.max(0, val-8);
    }


    function addPoint(att) {
      // hard cap of 15
      var maximumRawScore = 15;
      if (att < maximumRawScore) {
        var costChange = getPointCost(att+1) - getPointCost(att);
        if(vm.points >= costChange) {
          vm.points -= costChange;
          return att + 1;
        }
      }
      return att;
    }

    function removePoint(att) {
      // hard min of 8
      var minimumRawScore = 8;
      if (att > minimumRawScore) {
        var costChange = getPointCost(att) - getPointCost(att - 1);
        vm.points += costChange;
        return att - 1;
      }
      return att;
    }

    function getSaveMod(attribute) {
      if (!vm.character.playableClass || !vm.character.playableClass[0].profession) {
        return 0;
      }
      var isProficient = vm.character.playableClass[0].profession.saveProficiencies.indexOf(attribute) > -1;
      var modifier = toModifierRaw(vm.character.attributes[attribute]);

      modifier += isProficient ? 2 : 0;

      return modifier > 0 ? '+' + modifier : modifier;
    }

    function toModifierRaw(attVal) {
      return Math.floor((attVal-10) / 2);
    }

    function toModifier(attVal) {
      var modifier = toModifierRaw(attVal);
      if(modifier > 0) {
        return '+' + modifier;
      }
      return modifier;
    }

    function getActualValue(attribute) {
      if(!vm.character.race) {
        return vm.character.attributes[attribute];
      }
      if(vm.racialBonus === attribute) {
        return vm.character.attributes[attribute] + vm.character.race.abilityIncreases.Choice;
      }

      return vm.character.attributes[attribute] + vm.character.race.abilityIncreases[attribute];
    }

    function nextStep() {
      vm.step = Math.min(vm.creationSteps.length, vm.step + 1);
    }

    function previousStep() {
      vm.step = Math.max(0, vm.step - 1);
    }

    function finalize() {
      for(var att in vm.character.attributes) {
        vm.character.attributes[att] = getActualValue(att);
      }

      if(!vm.character.hitpoints) {
        vm.character.hitpoints = vm.character.playableClass[0].profession.hitDice + toModifierRaw(vm.character.attributes.Constitution);
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
      if (!isValid || !vm.character.playableClass[0].profession) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.characterForm');
        return false;
      }

      finalize();
      if (!vm.character.player) {
        vm.character.player = Authentication.user;
      }

      // TODO: move create/update logic to service
      if (vm.character._id) {
        // Make sure the user can do this action
        if(vm.character.player._id === Authentication.user._id || Authentication.user.roles.indexOf('admin') > -1) {
            vm.character.$update(successCallback, errorCallback);
            return;
        }
        console.log('User is not authorized to edit this character');
        return false;
      }
      else {
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
