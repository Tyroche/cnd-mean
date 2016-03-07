(function () {
  'use strict';

  // Contracts controller
  angular
    .module('contracts')
    .controller('ContractsController', ContractsController);

  ContractsController.$inject = ['$scope', '$state', 'Authentication', 'contractResolve'];

  function ContractsController ($scope, $state, Authentication, contract) {
    var vm = this;

    vm.authentication = Authentication;
    vm.contract = contract;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addReward = addReward;
    vm.removeReward = removeReward;
    vm.addPlaystyle = addPlaystyle;
    vm.removePlaystyle = removePlaystyle;

    // Add a playstyle
    function addPlaystyle() {
      if(!vm.contract.expectedPlaystyles) {
        vm.contract.expectedPlaystyles = [];
      }
      vm.contract.expectedPlaystyles.push("");
      console.log(vm.contract.expectedPlaystyles);
    }

    function removePlaystyle(index) {
      vm.contract.expectedPlaystyles.splice(index, 1);
      console.log(vm.contract.expectedPlaystyles);
    }

    // Add a reward
    function addReward() {
      if(!vm.contract.rewards) {
        vm.contract.rewards = [];
      }
      vm.contract.rewards.push({});
    }

    function removeReward(index) {
      vm.contract.rewards.splice(index, 1);
    }

    // Remove existing Contract
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.contract.$remove($state.go('contracts.list'));
      }
    }

    // Save Contract
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contractForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.contract._id) {
        vm.contract.$update(successCallback, errorCallback);
      } else {
        vm.contract.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('contracts.view', {
          contractId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
