(function () {
  'use strict';

  describe('Episodes Route Tests', function () {
    // Initialize global variables
    var $scope,
      EpisodesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EpisodesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EpisodesService = _EpisodesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('episodes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/episodes');
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
          EpisodesController,
          mockEpisode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('episodes.view');
          $templateCache.put('modules/episodes/client/views/view-episode.client.view.html', '');

          // create mock Episode
          mockEpisode = new EpisodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Episode Name'
          });

          //Initialize Controller
          EpisodesController = $controller('EpisodesController as vm', {
            $scope: $scope,
            episodeResolve: mockEpisode
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:episodeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.episodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            episodeId: 1
          })).toEqual('/episodes/1');
        }));

        it('should attach an Episode to the controller scope', function () {
          expect($scope.vm.episode._id).toBe(mockEpisode._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/episodes/client/views/view-episode.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EpisodesController,
          mockEpisode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('episodes.create');
          $templateCache.put('modules/episodes/client/views/form-episode.client.view.html', '');

          // create mock Episode
          mockEpisode = new EpisodesService();

          //Initialize Controller
          EpisodesController = $controller('EpisodesController as vm', {
            $scope: $scope,
            episodeResolve: mockEpisode
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.episodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/episodes/create');
        }));

        it('should attach an Episode to the controller scope', function () {
          expect($scope.vm.episode._id).toBe(mockEpisode._id);
          expect($scope.vm.episode._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/episodes/client/views/form-episode.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EpisodesController,
          mockEpisode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('episodes.edit');
          $templateCache.put('modules/episodes/client/views/form-episode.client.view.html', '');

          // create mock Episode
          mockEpisode = new EpisodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Episode Name'
          });

          //Initialize Controller
          EpisodesController = $controller('EpisodesController as vm', {
            $scope: $scope,
            episodeResolve: mockEpisode
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:episodeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.episodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            episodeId: 1
          })).toEqual('/episodes/1/edit');
        }));

        it('should attach an Episode to the controller scope', function () {
          expect($scope.vm.episode._id).toBe(mockEpisode._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/episodes/client/views/form-episode.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
