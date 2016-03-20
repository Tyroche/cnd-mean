(function () {
  'use strict';

  // Items controller
  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$state', 'Authentication', 'itemResolve'];

  function ItemsController ($scope, $state, Authentication, item) {
    var vm = this;

    vm.authentication = Authentication;
    vm.item = item;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    function init() {
      if (!vm.item._id) {
        item.price = 0;
        item.rarity = 'Common';
        item.classification = 'Weapon';
      }
    }

    // Remove existing Item
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.item.$remove($state.go('items.list'));
      }
    }

    // Save Item
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.item._id) {
        vm.item.$update(successCallback, errorCallback);
      } else {
        vm.item.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('items.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    init();
  }
})();
