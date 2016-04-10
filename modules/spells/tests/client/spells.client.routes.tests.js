(function () {
  'use strict';

  describe('Spells Route Tests', function () {
    // Initialize global variables
    var $scope,
      SpellsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SpellsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SpellsService = _SpellsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('spells');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/spells');
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
          SpellsController,
          mockSpell;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('spells.view');
          $templateCache.put('modules/spells/client/views/view-spell.client.view.html', '');

          // create mock Spell
          mockSpell = new SpellsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Spell Name'
          });

          //Initialize Controller
          SpellsController = $controller('SpellsController as vm', {
            $scope: $scope,
            spellResolve: mockSpell
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:spellId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.spellResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            spellId: 1
          })).toEqual('/spells/1');
        }));

        it('should attach an Spell to the controller scope', function () {
          expect($scope.vm.spell._id).toBe(mockSpell._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/spells/client/views/view-spell.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SpellsController,
          mockSpell;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('spells.create');
          $templateCache.put('modules/spells/client/views/form-spell.client.view.html', '');

          // create mock Spell
          mockSpell = new SpellsService();

          //Initialize Controller
          SpellsController = $controller('SpellsController as vm', {
            $scope: $scope,
            spellResolve: mockSpell
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.spellResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/spells/create');
        }));

        it('should attach an Spell to the controller scope', function () {
          expect($scope.vm.spell._id).toBe(mockSpell._id);
          expect($scope.vm.spell._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/spells/client/views/form-spell.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SpellsController,
          mockSpell;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('spells.edit');
          $templateCache.put('modules/spells/client/views/form-spell.client.view.html', '');

          // create mock Spell
          mockSpell = new SpellsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Spell Name'
          });

          //Initialize Controller
          SpellsController = $controller('SpellsController as vm', {
            $scope: $scope,
            spellResolve: mockSpell
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:spellId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.spellResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            spellId: 1
          })).toEqual('/spells/1/edit');
        }));

        it('should attach an Spell to the controller scope', function () {
          expect($scope.vm.spell._id).toBe(mockSpell._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/spells/client/views/form-spell.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
