(function () {
  'use strict';

  describe('Configurations Route Tests', function () {
    // Initialize global variables
    var $scope,
      ConfigurationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ConfigurationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ConfigurationsService = _ConfigurationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('configurations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/configurations');
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
          ConfigurationsController,
          mockConfiguration;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('configurations.view');
          $templateCache.put('modules/configurations/client/views/view-configuration.client.view.html', '');

          // create mock Configuration
          mockConfiguration = new ConfigurationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Configuration Name'
          });

          //Initialize Controller
          ConfigurationsController = $controller('ConfigurationsController as vm', {
            $scope: $scope,
            configurationResolve: mockConfiguration
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:configurationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.configurationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            configurationId: 1
          })).toEqual('/configurations/1');
        }));

        it('should attach an Configuration to the controller scope', function () {
          expect($scope.vm.configuration._id).toBe(mockConfiguration._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/configurations/client/views/view-configuration.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ConfigurationsController,
          mockConfiguration;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('configurations.create');
          $templateCache.put('modules/configurations/client/views/form-configuration.client.view.html', '');

          // create mock Configuration
          mockConfiguration = new ConfigurationsService();

          //Initialize Controller
          ConfigurationsController = $controller('ConfigurationsController as vm', {
            $scope: $scope,
            configurationResolve: mockConfiguration
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.configurationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/configurations/create');
        }));

        it('should attach an Configuration to the controller scope', function () {
          expect($scope.vm.configuration._id).toBe(mockConfiguration._id);
          expect($scope.vm.configuration._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/configurations/client/views/form-configuration.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ConfigurationsController,
          mockConfiguration;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('configurations.edit');
          $templateCache.put('modules/configurations/client/views/form-configuration.client.view.html', '');

          // create mock Configuration
          mockConfiguration = new ConfigurationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Configuration Name'
          });

          //Initialize Controller
          ConfigurationsController = $controller('ConfigurationsController as vm', {
            $scope: $scope,
            configurationResolve: mockConfiguration
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:configurationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.configurationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            configurationId: 1
          })).toEqual('/configurations/1/edit');
        }));

        it('should attach an Configuration to the controller scope', function () {
          expect($scope.vm.configuration._id).toBe(mockConfiguration._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/configurations/client/views/form-configuration.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
