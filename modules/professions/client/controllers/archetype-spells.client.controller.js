(function() {
  'use strict';

  angular
    .module('professions')
    .controller('ArchetypeSpellsController', ArchetypeSpellsController);

  ArchetypeSpellsController.$inject = [
    '$scope',
    'professionResolve',
    '$resource'
  ];

  function ArchetypeSpellsController($scope, profession, $resource) {
    var vm = this;
    vm.profession = profession;

    init();

    function init() {
      $resource('api/spells').query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No Spells found!!!');
          vm.spells = [];
        }
        vm.spells = res;
      });
    }
  }
})();
