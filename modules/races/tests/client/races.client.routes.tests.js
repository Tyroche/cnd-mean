(function () {
  'use strict';

  describe('Races Route Tests', function () {
    // Initialize global variables
    var $scope,
      RacesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RacesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RacesService = _RacesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('races');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/races');
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
          RacesController,
          mockRace;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('races.view');
          $templateCache.put('modules/races/client/views/view-race.client.view.html', '');

          // create mock Race
          mockRace = new RacesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Race Name'
          });

          //Initialize Controller
          RacesController = $controller('RacesController as vm', {
            $scope: $scope,
            raceResolve: mockRace
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:raceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.raceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            raceId: 1
          })).toEqual('/races/1');
        }));

        it('should attach an Race to the controller scope', function () {
          expect($scope.vm.race._id).toBe(mockRace._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/races/client/views/view-race.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RacesController,
          mockRace;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('races.create');
          $templateCache.put('modules/races/client/views/form-race.client.view.html', '');

          // create mock Race
          mockRace = new RacesService();

          //Initialize Controller
          RacesController = $controller('RacesController as vm', {
            $scope: $scope,
            raceResolve: mockRace
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.raceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/races/create');
        }));

        it('should attach an Race to the controller scope', function () {
          expect($scope.vm.race._id).toBe(mockRace._id);
          expect($scope.vm.race._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/races/client/views/form-race.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RacesController,
          mockRace;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('races.edit');
          $templateCache.put('modules/races/client/views/form-race.client.view.html', '');

          // create mock Race
          mockRace = new RacesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Race Name'
          });

          //Initialize Controller
          RacesController = $controller('RacesController as vm', {
            $scope: $scope,
            raceResolve: mockRace
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:raceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.raceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            raceId: 1
          })).toEqual('/races/1/edit');
        }));

        it('should attach an Race to the controller scope', function () {
          expect($scope.vm.race._id).toBe(mockRace._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/races/client/views/form-race.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
