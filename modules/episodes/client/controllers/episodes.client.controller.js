(function () {
  'use strict';

  // Episodes controller
  angular
    .module('episodes')
    .controller('EpisodesController', EpisodesController);

  EpisodesController.$inject = ['$scope', '$state', 'Authentication', 'episodeResolve'];

  function EpisodesController ($scope, $state, Authentication, episode) {
    var vm = this;

    vm.authentication = Authentication;
    vm.episode = episode;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Episode
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.episode.$remove($state.go('episodes.list'));
      }
    }

    // Save Episode
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.episodeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.episode._id) {
        vm.episode.$update(successCallback, errorCallback);
      } else {
        vm.episode.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('episodes.view', {
          episodeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
