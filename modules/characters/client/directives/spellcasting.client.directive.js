(function () {
  'use strict';

  angular
    .module('characters')
    .directive('spellcasting', spellcasting);

  spellcasting.$inject = [/*Example: '$state', '$window' */];

  function spellcasting(/*Example: $state, $window */) {
    return {
      templateUrl: 'modules/characters/client/views/directives/spellcasting.view.html',
    };
  }
})();
