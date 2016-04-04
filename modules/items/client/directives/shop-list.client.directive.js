(function () {
  'use strict';

  angular
    .module('items')
    .directive('shopList', shopList);

  shopList.$inject = ['Authentication'];

  // This assumes that you will pass the inventory to it
  function shopList(auth) {
    var controller = function($scope, $filter, $sce) {
      var vm = this;
      vm.character = $scope.character;
      vm.inventory = $scope.inventory;
      vm.name = $scope.name;
      vm.itemsPerPage = $scope.itemsPerPage ? $scope.itemsPerPage : 10;
      vm.addItem = addItem;
      vm.buildPager = buildPager;
      vm.determineDisplayedItems = determineDisplayedItems;
      vm.pageChanged = pageChanged;

      function init() {
        buildPager();
      }

      function buildPager () {
        vm.pagedItems = [];
        vm.currentPage = 1;
        vm.determineDisplayedItems();
      }

      function determineDisplayedItems () {
        vm.filteredItems = $filter('filter')(vm.inventory, {
          $: vm.search
        });
        vm.filterLength = vm.filteredItems.length;
        var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
        var end = begin + vm.itemsPerPage;
        vm.pagedItems = vm.filteredItems.slice(begin, end);
      }

      function pageChanged () {
        vm.determineDisplayedItems();
      }

      // To inventory.client.service
      function addItem(item) {
        if(vm.character.player && vm.character.player._id !== auth.user._id && auth.user.roles.indexOf('admin') > -1) {
          vm.character.items.push(item);
          vm.character.$update();
          return;
        }

        if(vm.character.funds - item.price >= 0) {
          vm.character.items.push(item);
          vm.character.funds -= item.price;
          vm.character.$update();
        }
      }

      init();
    };

    return {
      templateUrl: 'modules/items/client/views/directives/shop-list.view.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        character: '=',
        inventory: '=',
        itemsPerPage: '@',
        name: '@'
      }
    };
  }
})();
