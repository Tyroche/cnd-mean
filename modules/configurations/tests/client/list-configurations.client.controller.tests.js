(function () {
  'use strict';

  describe('Configurations List Controller Tests', function () {
    // Initialize global variables
    var ConfigurationsListController,
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

      // create mock article
      mockConfiguration = new ConfigurationsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Configuration Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Configurations List controller.
      ConfigurationsListController = $controller('ConfigurationsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockConfigurationList;

      beforeEach(function () {
        mockConfigurationList = [mockConfiguration, mockConfiguration];
      });

      it('should send a GET request and return all Configurations', inject(function (ConfigurationsService) {
        // Set POST response
        $httpBackend.expectGET('api/configurations').respond(mockConfigurationList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.configurations.length).toEqual(2);
        expect($scope.vm.configurations[0]).toEqual(mockConfiguration);
        expect($scope.vm.configurations[1]).toEqual(mockConfiguration);

      }));
    });
  });
})();
