(function () {
  'use strict';

  angular
    .module('characters')
    .directive('statRow', statRow);

  function statRow() {
    var directive = {
      bindToController: true,
      restrict: 'EA',
      templateUrl: 'modules/characters/client/views/stat-row-view.client.view.html',
      link: function(scope, elem, attrs) {
        scope.attribute = 8;
      }
    };

    return directive;
  }
})();
