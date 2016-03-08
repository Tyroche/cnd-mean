(function () {
  'use strict';

  // Configurations controller
  angular
    .module('configurations')
    .controller('ConfigurationsController', ConfigurationsController);

  ConfigurationsController.$inject = ['$scope', '$state', 'Authentication', 'configurationResolve'];

  function ConfigurationsController ($scope, $state, Authentication, configuration) {
    var vm = this;

    $scope.raceHidden = [];
    $scope.classHidden = [];
    vm.authentication = Authentication;
    vm.configuration = configuration;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addClass = addClass;
    vm.addRace = addRace;
    vm.toggleRaceVisibility = toggleRaceVisibility;
    vm.toggleClassVisibility = toggleClassVisibility;


    function addRace() {
      if(!vm.configuration.races) {
        vm.configuration.races = [];
      }
      $scope.raceHidden.push(false);
      vm.configuration.races.push({});
    }

    function addClass() {
      if(!vm.configuration.classes) {
        vm.configuration.classes = [];
      }
      $scope.classHidden.push(false);
      vm.configuration.classes.push({});
    }

    function toggleRaceVisibility(index) {
      $scope.raceHidden[index] = !$scope.raceHidden[index];
    }
    function toggleClassVisibility(index) {
      $scope.classHidden[index] = !$scope.classHidden[index];
    }


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
