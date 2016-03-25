'use strict';

angular.module('core').controller('HomeController', ['$scope', '$resource', 'Authentication',
  function ($scope, $resource, Authentication) {
    var vm = this;

    // This provides Authentication context.
    $scope.authentication = Authentication;

    init();
    function init() {
      $resource('/api/articles').query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No News found!!!');
          return [];
        }
        $scope.news = res.slice(0, 3);
      });
    }
  }
]);
