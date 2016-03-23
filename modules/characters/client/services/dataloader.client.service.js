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

    function loadItems(user) {
      var itemQuery = 'api/common/items';
      if(user.roles.indexOf('admin') > -1) {
        itemQuery = '/api/items';
      }

      // Actually Query now
      return $resource(itemQuery).query({}, function(res) {
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
      loadData: function (character, user) {
        return {
          items: loadItems(user),
          races: loadRaces(),
          classes: loadClasses(),
          backgrounds: loadBackgrounds()
        };
      }
    };
  }
})();
