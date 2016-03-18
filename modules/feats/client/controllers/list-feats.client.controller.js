(function () {
  'use strict';

  angular
    .module('feats')
    .controller('FeatsListController', FeatsListController);

  FeatsListController.$inject = ['FeatsService'];

  function FeatsListController(FeatsService) {
    var vm = this;

    vm.feats = FeatsService.query();
  }
})();
