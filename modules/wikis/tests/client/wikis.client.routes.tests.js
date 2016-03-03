(function () {
  'use strict';

  describe('Wikis Route Tests', function () {
    // Initialize global variables
    var $scope,
      WikisService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _WikisService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      WikisService = _WikisService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('wikis');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/wikis');
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
          WikisController,
          mockWiki;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('wikis.view');
          $templateCache.put('modules/wikis/client/views/view-wiki.client.view.html', '');

          // create mock Wiki
          mockWiki = new WikisService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Wiki Name'
          });

          //Initialize Controller
          WikisController = $controller('WikisController as vm', {
            $scope: $scope,
            wikiResolve: mockWiki
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:wikiId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.wikiResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            wikiId: 1
          })).toEqual('/wikis/1');
        }));

        it('should attach an Wiki to the controller scope', function () {
          expect($scope.vm.wiki._id).toBe(mockWiki._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/wikis/client/views/view-wiki.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          WikisController,
          mockWiki;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('wikis.create');
          $templateCache.put('modules/wikis/client/views/form-wiki.client.view.html', '');

          // create mock Wiki
          mockWiki = new WikisService();

          //Initialize Controller
          WikisController = $controller('WikisController as vm', {
            $scope: $scope,
            wikiResolve: mockWiki
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.wikiResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/wikis/create');
        }));

        it('should attach an Wiki to the controller scope', function () {
          expect($scope.vm.wiki._id).toBe(mockWiki._id);
          expect($scope.vm.wiki._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/wikis/client/views/form-wiki.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          WikisController,
          mockWiki;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('wikis.edit');
          $templateCache.put('modules/wikis/client/views/form-wiki.client.view.html', '');

          // create mock Wiki
          mockWiki = new WikisService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Wiki Name'
          });

          //Initialize Controller
          WikisController = $controller('WikisController as vm', {
            $scope: $scope,
            wikiResolve: mockWiki
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:wikiId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.wikiResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            wikiId: 1
          })).toEqual('/wikis/1/edit');
        }));

        it('should attach an Wiki to the controller scope', function () {
          expect($scope.vm.wiki._id).toBe(mockWiki._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/wikis/client/views/form-wiki.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
