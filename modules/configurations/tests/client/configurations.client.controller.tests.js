(function () {
  'use strict';

  describe('Configurations Controller Tests', function () {
    // Initialize global variables
    var ConfigurationsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ConfigurationsService,
      mockConfiguration;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ConfigurationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ConfigurationsService = _ConfigurationsService_;

      // create mock Configuration
      mockConfiguration = new ConfigurationsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Configuration Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Configurations controller.
      ConfigurationsController = $controller('ConfigurationsController as vm', {
        $scope: $scope,
        configurationResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleConfigurationPostData;

      beforeEach(function () {
        // Create a sample Configuration object
        sampleConfigurationPostData = new ConfigurationsService({
          name: 'Configuration Name'
        });

        $scope.vm.configuration = sampleConfigurationPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ConfigurationsService) {
        // Set POST response
        $httpBackend.expectPOST('api/configurations', sampleConfigurationPostData).respond(mockConfiguration);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Configuration was created
        expect($state.go).toHaveBeenCalledWith('configurations.view', {
          configurationId: mockConfiguration._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/configurations', sampleConfigurationPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Configuration in $scope
        $scope.vm.configuration = mockConfiguration;
      });

      it('should update a valid Configuration', inject(function (ConfigurationsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/configurations\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('configurations.view', {
          configurationId: mockConfiguration._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ConfigurationsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/configurations\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Configurations
        $scope.vm.configuration = mockConfiguration;
      });

      it('should delete the Configuration and redirect to Configurations', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/configurations\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('configurations.list');
      });

      it('should should not delete the Configuration and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
