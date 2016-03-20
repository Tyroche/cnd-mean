(function () {
  'use strict';

  angular
    .module('characters')
    .factory('Dataloader', Dataloader);

  Dataloader.$inject = ['$resource'];

  function Dataloader($resource) {
    function loadClasses() {
      return $resource('api/professions').query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No Classes found!!!');
          return;
        }
        return res;
      });
    }

    function loadRaces() {
      return $resource('api/races').query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No Races found!!!');
          return [];
        }
        return res;
      });
    }

    function loadItems() {
      // Actually Query now
      return $resource('api/common/items').query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No Items found!!!');
          return [];
        }
        return res;
      });
    }

    function loadBackgrounds() {
      // Actually Query now
      return $resource('api/backgrounds').query({}, function(res) {
        if (!res[0]) {
          console.log('ERROR: No Backgrounds found!!!');
          return [];
        }
        return res;
      });
    }

    return {
      loadForCreation: function () {
        return {
          items: loadItems(),
          races: loadRaces(),
          classes: loadClasses(),
          backgrounds: loadBackgrounds()
        };
      }
    };
  }
})();
