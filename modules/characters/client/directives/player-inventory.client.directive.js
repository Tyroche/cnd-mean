(function () {
  'use strict';

  angular
    .module('characters')
    .directive('playerInventory', playerInventory);

  playerInventory.$inject = [/*Example: '$state', '$window' */];

  function playerInventory(/*Example: $state, $window */) {
    var controller = function($scope) {
      var vm = this;
      vm.character = $scope.character;
      vm.canEquip = $scope.canEquip === 'true';
      vm.canSell = $scope.canSell === 'true';

      vm.removeItem = removeItem;
      vm.sumInventoryPrice = sumInventoryPrice;
      vm.accountForMultiples = accountForMultiples;

      function accountForMultiples(item) {
        var multiples = vm.character.items.reduce(function(n, val) {
          return n + (val._id === item._id ? 1: 0);
        },0);

        return (multiples > 1) ? ' x' + multiples : '';
      }

      function removeItem(item) {
        var ind = vm.character.items.indexOf(item);
        vm.character.items.splice(ind, 1);
        vm.character.funds += item.price;

        if (vm.character._id) {
          vm.character.$update();  
        }
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
    };

    return {
      templateUrl: 'modules/characters/client/views/directives/player-inventory.view.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        character: '=',
        canEquip: '@',
        canSell: '@'
      }
    };
  }
})();
