(function () {
  'use strict';

  describe('Episodes Controller Tests', function () {
    // Initialize global variables
    var EpisodesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      EpisodesService,
      mockEpisode;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _EpisodesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      EpisodesService = _EpisodesService_;

      // create mock Episode
      mockEpisode = new EpisodesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Episode Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Episodes controller.
      EpisodesController = $controller('EpisodesController as vm', {
        $scope: $scope,
        episodeResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleEpisodePostData;

      beforeEach(function () {
        // Create a sample Episode object
        sampleEpisodePostData = new EpisodesService({
          name: 'Episode Name'
        });

        $scope.vm.episode = sampleEpisodePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (EpisodesService) {
        // Set POST response
        $httpBackend.expectGET('api/characters').respond([{ player: { id: 5 } }]);
        $httpBackend.expectPOST('api/episodes', sampleEpisodePostData).respond(mockEpisode);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Episode was created
        expect($state.go).toHaveBeenCalledWith('episodes.view', {
          episodeId: mockEpisode._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectGET('api/characters').respond([{ player: { id: 5 } }]);
        $httpBackend.expectPOST('api/episodes', sampleEpisodePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Episode in $scope
        $scope.vm.episode = mockEpisode;
      });

      it('should update a valid Episode', inject(function (EpisodesService) {
        // Set PUT response
        $httpBackend.expectGET('api/characters').respond([{ player: { id: 5 } }]);
        $httpBackend.expectPUT(/api\/episodes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('episodes.view', {
          episodeId: mockEpisode._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (EpisodesService) {
        var errorMessage = 'error';
        $httpBackend.expectGET('api/characters').respond([{ player: { id: 5 } }]);
        $httpBackend.expectPUT(/api\/episodes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Episodes
        $scope.vm.episode = mockEpisode;
      });

      it('should delete the Episode and redirect to Episodes', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectGET('api/characters').respond([{ player: { id: 5 } }]);
        $httpBackend.expectDELETE(/api\/episodes\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('episodes.list');
      });

      it('should should not delete the Episode and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
