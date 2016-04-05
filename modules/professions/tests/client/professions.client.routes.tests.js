(function () {
  'use strict';

  describe('Professions Route Tests', function () {
    // Initialize global variables
    var $scope,
      ProfessionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ProfessionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ProfessionsService = _ProfessionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('professions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/professions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ProfessionsController,
          mockProfession;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('professions.view');
          $templateCache.put('modules/professions/client/views/view-profession.client.view.html', '');

          // create mock Profession
          mockProfession = new ProfessionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Profession Name'
          });

          //Initialize Controller
          ProfessionsController = $controller('ProfessionsController as vm', {
            $scope: $scope,
            professionResolve: mockProfession
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:professionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.professionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            professionId: 1
          })).toEqual('/professions/1');
        }));

        it('should attach an Profession to the controller scope', function () {
          expect($scope.vm.profession._id).toBe(mockProfession._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/professions/client/views/view-profession.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ProfessionsController,
          mockProfession;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('professions.create');
          $templateCache.put('modules/professions/client/views/form-profession.client.view.html', '');

          // create mock Profession
          mockProfession = new ProfessionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Profession Name',
            archetypes: []
          });

          //Initialize Controller
          ProfessionsController = $controller('ProfessionsController as vm', {
            $scope: $scope,
            professionResolve: mockProfession
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.professionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/professions/create');
        }));

        it('should attach an Profession to the controller scope', function () {
          expect($scope.vm.profession._id).toBe(mockProfession._id);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/professions/client/views/form-profession.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ProfessionsController,
          mockProfession;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('professions.edit');
          $templateCache.put('modules/professions/client/views/form-profession.client.view.html', '');

          // create mock Profession
          mockProfession = new ProfessionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Profession Name'
          });

          //Initialize Controller
          ProfessionsController = $controller('ProfessionsController as vm', {
            $scope: $scope,
            professionResolve: mockProfession
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:professionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.professionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            professionId: 1
          })).toEqual('/professions/1/edit');
        }));

        it('should attach an Profession to the controller scope', function () {
          expect($scope.vm.profession._id).toBe(mockProfession._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/professions/client/views/form-profession.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
