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

    vm.addItem = addItem;
    vm.removeItem = removeItem;
    vm.sumInventoryPrice = sumInventoryPrice;
    vm.accountForMultiples = accountForMultiples;

    vm.points = 27;
    vm.removePoint = removePoint;
    vm.addPoint = addPoint;
    vm.getActualValue = getActualValue;
    vm.toModifier = toModifier;
    vm.toModifierRaw = toModifierRaw;
    vm.getSaveMod = getSaveMod;
    vm.getSkillMod = getSkillMod;
    vm.toggleProficiency = toggleProficiency;
    vm.numberProficiencies = numberProficiencies;
    vm.randomizeBackground = randomizeBackground;

    init();
    function init() {
      vm.loadedData = dataLoader.loadData(vm.character, Authentication.user);
      vm.skills = characterSources.getSkills();
      vm.creationSteps = characterSources.getSteps();
      vm.racialBonus = '';

      if (!vm.character._id) {
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
    }

    function randomizeBackground(type) {
      if(!vm.character.background.generalization) { return 'Can\'t randomize'; }
      var backgroundType = vm.character.background.generalization[type + 's'];
      var choice = Math.floor(Math.random() * backgroundType.length);
      vm.character.background[type] = backgroundType[choice];
    }

    function getSkillMod(skill, attribute) {
      var mod = toModifierRaw(vm.character.attributes[attribute]);
      if(vm.character.skills.indexOf(skill) > -1 || vm.character.background.generalization.skillProficiencies.indexOf(skill) > -1) {
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
        return;
      }
      vm.character.skills.push(skill);
    }

    function getPointCost(val) {
      return Math.max(0, (val-13)) + Math.max(0, val-8);
    }

    function numberProficiencies() {
      return parseInt(vm.character.playableClass[0].profession.numSkillProficiencies) + parseInt(vm.character.race.numSkillProficiencies);
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

    function accountForMultiples(item) {
      var multiples = vm.character.items.reduce(function(n, val) {
        return n + (val._id === item._id ? 1: 0);
      },0);

      return (multiples > 0) ? ' x' + multiples : '';
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

    function finalize() {
      for(var att in vm.character.attributes) {
        vm.character.attributes[att] = getActualValue(att);
      }

      vm.character.hitpoints = vm.character.playableClass[0].profession.hitDice + toModifierRaw(vm.character.attributes.Constitution);
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
        if(vm.character.player._id === Authentication.user._id || Authentication.user.roles.indexOf('admin') > -1) {
            vm.character.$update(successCallback, errorCallback);
            return;
        }
        console.log('User is not authorized to edit this character');
        return false;
      } else {
        finalize();
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
