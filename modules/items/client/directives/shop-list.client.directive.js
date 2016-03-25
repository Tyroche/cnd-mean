(function () {
  'use strict';

  angular
    .module('items')
    .directive('shopList', shopList);

  shopList.$inject = [];

  // This assumes that you will pass the inventory to it
  function shopList() {
    var controller = function($scope) {
      var vm = this;
      vm.character = $scope.character;
      vm.name = $scope.name;
      vm.inventory = $scope.inventory;
      vm.addItem = addItem;

      // To inventory.client.service
      function addItem(item) {
        if(vm.character.funds - item.price >= 0) {
          vm.character.items.push(item);
          vm.character.funds -= item.price;
          vm.character.$update();
        }
      }
    };

    return {
      templateUrl: 'modules/items/client/views/directives/shop-list.view.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        character: '=',
        inventory: '=',
        name: '@'
      }
    };
  }
})();
