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

    vm.toggleItem = toggleItem;
    vm.sumInventoryPrice = sumInventoryPrice;

    vm.points = 27;
    vm.removePoint = removePoint;
    vm.addPoint = addPoint;
    vm.getActualValue = getActualValue;
    vm.toModifier = toModifier;
    vm.getSaveMod = getSaveMod;
    vm.getSkillMod = getSkillMod;
    vm.toggleProficiency = toggleProficiency;

    vm.randomizeBackground = randomizeBackground;

    init();
    function init() {
      vm.skills = characterSources.getSkills();
      vm.creationSteps = characterSources.getSteps();

      if (!vm.character._id) {
        vm.character.funds = 100;
        vm.character.skills = [];
        vm.character.playableClass = [{
          profession: undefined,
          level: 1
        }];
        vm.character.items = [];
        vm.character.background = {};
        vm.loadedData = dataLoader.loadForCreation(vm.character);
      }
    }

    function randomizeBackground(type) {
      var backgroundType = vm.chosenBackground[type + 's'];
      var choice = Math.floor(Math.random() * backgroundType.length);
      vm.character.background[type] = backgroundType[choice];
    }

    function getSkillMod(skill, attribute) {
      var mod =  Math.floor((vm.getActualValue(attribute)-10) / 2);
      if(vm.character.skills.indexOf(skill) > -1) {
        return getProficiency() + mod;
      }
      return mod;
    }

    function getProficiency() {
      return 2;
    }

    function toggleProficiency(skill) {
      var skillIndex = vm.character.skills.indexOf(skill);
      if(skillIndex > -1) {
        vm.character.skills.splice(skillIndex, 1);
        console.log(vm.character.skills);
        return;
      }
      vm.character.skills.push(skill);
      console.log(vm.character.skills);
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
      var modifier = Math.floor((getActualValue(attribute) -10) / 2);

      modifier += isProficient ? 2 : 0;

      return modifier > 0 ? '+' + modifier : modifier;
    }

    function toModifier(attVal) {
      var modifier = Math.floor((attVal-10) / 2);
      if(modifier > 0) {
        return '+' + modifier;
      }
      return modifier;
    }

    function getActualValue(attribute) {
      if(!vm.character.race) {
        return vm.character.attributes[attribute];
      }

      return vm.character.attributes[attribute] + vm.character.race.abilityIncreases[attribute];
    }

    function nextStep() {
      vm.step = Math.min(vm.creationSteps.length, vm.step + 1);
    }

    function previousStep() {
      vm.step = Math.max(0, vm.step - 1);
    }

    // To inventory.client.service
    function addItem(item) {
      if(vm.character.funds - item.price >= 0) {
        vm.character.items.push(item);
        vm.character.funds -= item.price;
      }
    }

    function removeItem(item) {
      var ind = vm.character.items.indexOf(item);
      vm.character.items.splice(ind, 1);
      vm.character.funds += item.price;
    }

    function toggleItem(item) {
      if(vm.character.items.indexOf(item) > -1){
        removeItem(item);
        return;
      }
      addItem(item);
    }

    function sumInventoryPrice() {
      if (!vm.character.items || vm.character.items.length === 0) {
        return 0;
      }

      if (vm.character.items.length === 1) {
        return vm.character.items[0].price;
      }

      return vm.character.items.reduce(function(prev, cur) {
        return prev.price + cur.price;
      });
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

      if (!vm.character.player) {
        vm.character.player = Authentication.user;
      }

      // TODO: move create/update logic to service
      if (vm.character._id) {
        vm.character.$update(successCallback, errorCallback);
      } else {
        // Get the actual attribute values
        for(var att in vm.character.attributes) {
          vm.character.attributes[att] = getActualValue(att);
        }

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
