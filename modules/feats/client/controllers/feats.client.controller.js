(function () {
  'use strict';

  // Feats controller
  angular
    .module('feats')
    .controller('FeatsController', FeatsController);

  FeatsController.$inject = ['$scope', '$state', 'Authentication', 'featResolve'];

  function FeatsController ($scope, $state, Authentication, feat) {
    var vm = this;

    vm.authentication = Authentication;
    vm.feat = feat;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Feat
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.feat.$remove($state.go('feats.list'));
      }
    }

    // Save Feat
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.featForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.feat._id) {
        vm.feat.$update(successCallback, errorCallback);
      } else {
        vm.feat.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('feats.view', {
          featId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
