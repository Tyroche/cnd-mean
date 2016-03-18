(function () {
  'use strict';

  // Races controller
  angular
    .module('races')
    .controller('RacesController', RacesController);

  RacesController.$inject = ['$scope', '$state', 'Authentication', 'raceResolve'];

  function RacesController ($scope, $state, Authentication, race) {
    var vm = this;

    vm.authentication = Authentication;
    vm.race = race;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Race
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.race.$remove($state.go('races.list'));
      }
    }

    // Save Race
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.raceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.race._id) {
        vm.race.$update(successCallback, errorCallback);
      } else {
        vm.race.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('races.view', {
          raceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
