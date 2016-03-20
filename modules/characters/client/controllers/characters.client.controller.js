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
    'ProfessionsService',
    'RacesService'];

  function CharactersController ($scope, $state, $resource, Authentication, character, classService, raceService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.character = character;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.step = 0;
    vm.nextStep = nextStep;
    vm.previousStep = previousStep;

    vm.toggleItem = toggleItem;
    vm.sumInventoryPrice = sumInventoryPrice;

    vm.points = 27;
    vm.removePoint = removePoint;
    vm.addPoint = addPoint;

    vm.toModifier = toModifier;
    vm.getSaveMod = getSaveMod;

    init();
    function init() {
      if (!vm.character._id) {
        vm.character.funds = 100;
        loadItems();
        loadClasses();
        loadRaces();
      }
    }

    function loadClasses() {
      classService.query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No Classes found!!!');
          return;
        }
        vm.playableClasses = res;
        vm.character.playableClass = [ res[0] ];
      });
    }

    function loadRaces() {
      raceService.query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No Races found!!!');
          return;
        }
        vm.playableRaces = res;
        vm.character.race = res[0];
      });}

    function loadItems() {
      // Actually Query now
      $resource('api/common/items').query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No Items found!!!');
          return;
        }
        vm.items = res;
      });
    }

    function getSaveMod(attribute) {
      if (!vm.character.playableClass[0]) {
        return 0;
      }
      var proficiency = vm.character.playableClass[0].saveProficiencies.indexOf(attribute) > -1;
      var modifier = Math.floor((vm.character.attributes[attribute] -10) / 2);
      if (proficiency) {
         modifier += 2;
      }
      if(modifier > 0) {
        return '+' + modifier;
      }
      return modifier;
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

    function toModifier(attVal) {
      var modifier = Math.floor((attVal-10) / 2);
      if(modifier > 0) {
        return '+' + modifier;
      }
      return modifier;
    }

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
      }
    ];

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

    function nextStep() {
      vm.step = Math.min(vm.creationSteps.length, vm.step + 1);
    }

    function previousStep() {
      vm.step = Math.max(0, vm.step - 1);
    }

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
