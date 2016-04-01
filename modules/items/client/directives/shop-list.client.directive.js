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
      vm.renderTooltip = renderTooltip;

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

      function renderTooltip(item){

        var rarity = '';
        var name   = '<span class="bold-item-name">' + item.name + '</span>';
        var description = item.description;

        switch(item.rarity){
          case "Common":
            rarity = '<hr/><span class="rarity-commmon">Common</span><hr/>';
            break;
          case "Uncommon":
            rarity = '<hr/><span class="rarity-uncommmon">Uncommon</span><hr/>';
            break;
          case "Rare":
            rarity = '<hr/><span class="rarity-rare">Rare</span><hr/>';
            break;
          case "Very Rare":
            rarity = '<hr/><span class="rarity-very-rare">Very Rare</span><hr/>';
            break;
          case "Legendary":
            rarity = '<hr/><span class="rarity-legendary">Legendary</span><hr/>';
            break;
          case "Artifact":
            rarity = '<hr/><span class="rarity-artifact">Artifact</span><hr/>';
            break;
          case "Unique":
            rarity = '<hr/><span class="rarity-unique">Unique</span><hr/>';
            break;
          default:
            rarity = '<hr/><span class="rarity-commmon">Unknown</span><hr/>';
            break;
        }

        var finalResult = name + rarity + description;

        vm.tooltipString = $sce.trustAsHtml(finalResult);
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
