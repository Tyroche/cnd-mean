(function () {
  'use strict';

  // Configurations controller
  angular
    .module('configurations')
    .controller('ConfigurationsController', ConfigurationsController);

  ConfigurationsController.$inject = ['$scope', '$state', 'Authentication', 'configurationResolve'];

  function ConfigurationsController ($scope, $state, Authentication, configuration) {
    var vm = this;

    vm.authentication = Authentication;
    vm.configuration = configuration;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Configuration
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.configuration.$remove($state.go('configurations.list'));
      }
    }

    // Save Configuration
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.configurationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.configuration._id) {
        vm.configuration.$update(successCallback, errorCallback);
      } else {
        vm.configuration.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('configurations.view', {
          configurationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
