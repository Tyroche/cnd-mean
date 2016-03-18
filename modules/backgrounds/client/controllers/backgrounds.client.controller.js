(function () {
  'use strict';

  // Backgrounds controller
  angular
    .module('backgrounds')
    .controller('BackgroundsController', BackgroundsController);

  BackgroundsController.$inject = ['$scope', '$state', 'Authentication', 'backgroundResolve'];

  function BackgroundsController ($scope, $state, Authentication, background) {
    var vm = this;

    vm.authentication = Authentication;
    vm.background = background;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Background
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.background.$remove($state.go('backgrounds.list'));
      }
    }

    // Save Background
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.backgroundForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.background._id) {
        vm.background.$update(successCallback, errorCallback);
      } else {
        vm.background.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('backgrounds.view', {
          backgroundId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
