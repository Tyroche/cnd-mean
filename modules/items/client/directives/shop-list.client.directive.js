(function () {
  'use strict';

  angular
    .module('items')
    .directive('shopList', shopList);

  shopList.$inject = [/*Example: '$state', '$window' */];

  function shopList(/*Example: $state, $window */) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // Shop list directive logic
        // ...

        element.text('this is the shopList directive');
      }
    };
  }
})();
