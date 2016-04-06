(function () {
  'use strict';

  // Spells controller
  angular
    .module('spells')
    .controller('SpellsController', SpellsController);

  SpellsController.$inject = ['$scope', '$state', 'Authentication', 'spellResolve'];

  function SpellsController ($scope, $state, Authentication, spell) {
    var vm = this;

    vm.authentication = Authentication;
    vm.spell = spell;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Spell
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.spell.$remove($state.go('spells.list'));
      }
    }

    // Save Spell
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.spellForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.spell._id) {
        vm.spell.$update(successCallback, errorCallback);
      } else {
        vm.spell.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('spells.view', {
          spellId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
