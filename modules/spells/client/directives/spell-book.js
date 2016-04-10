(function () {
  'use strict';

  angular
    .module('spells')
    .directive('spellBook', spellBook);

  spellBook.$inject = ['Authentication', '$filter'];

  // This assumes that you will pass the spells to it
  function spellBook(auth) {
    var controller = function($scope, $filter) {
      var vm = this;

      function init() {
        // Parse from scope
        vm.itemsPerPage = $scope.display ? $scope.display : 10;
        vm.chosenArchetype = 0;
        vm.profession = $scope.profession;
        vm.spells = JSON.parse($scope.spells);

        buildPager();
      }

      // Figure out what spells need to be displayed
      vm.determineDisplayed = determineDisplayed;
      function determineDisplayed() {
        vm.filteredItems = $filter('filter')(vm.spells, {
          $: vm.search
        });
        vm.filterLength = vm.filteredItems.length;
        var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
        var end = begin + vm.itemsPerPage;
        vm.pagedItems = vm.filteredItems.slice(begin, end);
      }

      // Build the pager which houses all of the spells
      vm.buildPager = buildPager;
      function buildPager () {
        // Pager elements
        vm.pagedItems = [];
        vm.currentPage = 1;
        vm.determineDisplayed();
      }

      // Event occurring on page change
      vm.pageChanged = pageChanged;
      function pageChanged () {
        vm.determineDisplayed();
      }

      // To inventory.client.service
      vm.addSpell = addSpell;
      function addSpell(spell) {
        vm.profession.archetypes[vm.chosenArchetype].spellcasting.spells.push(spell._id);
        vm.profession.$update(successCallback);
      }

      function successCallback(res) {
        console.log('Successfull updated profession.');
      }

      init();
    };

    return {
      templateUrl: 'modules/spells/client/views/directives/spell-book.html',
      controller: controller,
      controllerAs: 'vm',
      scope: {
        profession: '=',
        spells: '@',
        display: '@'
      }
    };
  }
})();
