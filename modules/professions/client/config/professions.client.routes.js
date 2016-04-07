(function () {
  'use strict';

  angular
    .module('professions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('professions', {
        abstract: true,
        url: '/professions',
        template: '<ui-view/>'
      })
      .state('professions.list', {
        url: '',
        templateUrl: 'modules/professions/client/views/list-professions.client.view.html',
        controller: 'ProfessionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Professions List'
        }
      })
      .state('professions.create', {
        url: '/create',
        templateUrl: 'modules/professions/client/views/form-profession.client.view.html',
        controller: 'ProfessionsController',
        controllerAs: 'vm',
        resolve: {
          professionResolve: newProfession
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Professions Create'
        }
      })
      .state('professions.edit', {
        url: '/:professionId/edit',
        templateUrl: 'modules/professions/client/views/form-profession.client.view.html',
        controller: 'ProfessionsController',
        controllerAs: 'vm',
        resolve: {
          professionResolve: getProfession
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Profession {{ professionResolve.name }}'
        }
      })
      .state('professions.spells', {
        url: '/:professionId/spells',
        templateUrl: 'modules/professions/client/views/spells.client.view.html',
        controller: 'ArchetypeSpellsController',
        controllerAs: 'vm',
        resolve: {
          professionResolve: getProfession
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit {{ professionResolve.name }} Spells'
        }
      })
      .state('professions.view', {
        url: '/:professionId',
        templateUrl: 'modules/professions/client/views/view-profession.client.view.html',
        controller: 'ProfessionsController',
        controllerAs: 'vm',
        resolve: {
          professionResolve: getProfession
        },
        data:{
          pageTitle: 'Profession {{ articleResolve.name }}'
        }
      });
  }

  getProfession.$inject = ['$stateParams', 'ProfessionsService'];

  function getProfession($stateParams, ProfessionsService) {
    return ProfessionsService.get({
      professionId: $stateParams.professionId
    }).$promise;
  }

  newProfession.$inject = ['ProfessionsService'];

  function newProfession(ProfessionsService) {
    return new ProfessionsService();
  }
})();
