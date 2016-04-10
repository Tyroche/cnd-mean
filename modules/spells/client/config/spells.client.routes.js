(function () {
  'use strict';

  angular
    .module('spells')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('spells', {
        abstract: true,
        url: '/spells',
        template: '<ui-view/>'
      })
      .state('spells.list', {
        url: '',
        templateUrl: 'modules/spells/client/views/list-spells.client.view.html',
        controller: 'SpellsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Spells List'
        }
      })
      .state('spells.create', {
        url: '/create',
        templateUrl: 'modules/spells/client/views/form-spell.client.view.html',
        controller: 'SpellsController',
        controllerAs: 'vm',
        resolve: {
          spellResolve: newSpell
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Spells Create'
        }
      })
      .state('spells.edit', {
        url: '/:spellId/edit',
        templateUrl: 'modules/spells/client/views/form-spell.client.view.html',
        controller: 'SpellsController',
        controllerAs: 'vm',
        resolve: {
          spellResolve: getSpell
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Spell {{ spellResolve.name }}'
        }
      })
      .state('spells.view', {
        url: '/:spellId',
        templateUrl: 'modules/spells/client/views/view-spell.client.view.html',
        controller: 'SpellsController',
        controllerAs: 'vm',
        resolve: {
          spellResolve: getSpell
        },
        data:{
          pageTitle: 'Spell {{ articleResolve.name }}'
        }
      });
  }

  getSpell.$inject = ['$stateParams', 'SpellsService'];

  function getSpell($stateParams, SpellsService) {
    return SpellsService.get({
      spellId: $stateParams.spellId
    }).$promise;
  }

  newSpell.$inject = ['SpellsService'];

  function newSpell(SpellsService) {
    return new SpellsService();
  }
})();
