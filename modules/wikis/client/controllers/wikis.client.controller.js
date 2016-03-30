(function () {
  'use strict';

  // Wikis controller
  angular
    .module('wikis')
    .controller('WikisController', WikisController);

  WikisController.$inject = ['$scope', '$state', 'Authentication', 'wikiResolve'];

  function WikisController ($scope, $state, Authentication, wiki) {
    var vm = this;

    vm.authentication = Authentication;
    vm.wiki = wiki;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    init();
    function init() {
      if (!vm.wiki._id) {
        vm.wiki.sections = [{}];
      }
    }

    // Remove existing Wiki
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.wiki.$remove($state.go('wikis.list'));
      }
    }

    // Save Wiki
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.wikiForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.wiki._id) {
        vm.wiki.$update(successCallback, errorCallback);
      } else {
        vm.wiki.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('wikis.view', {
          wikiId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
