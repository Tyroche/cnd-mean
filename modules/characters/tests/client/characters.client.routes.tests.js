(function () {
  'use strict';

  describe('Characters Route Tests', function () {
    // Initialize global variables
    var $scope,
      CharactersService,
      Authentication;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CharactersService_, _Authentication_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CharactersService = _CharactersService_;
      Authentication = _Authentication_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('characters');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/characters');
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
          CharactersController,
          mockCharacter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('characters.view');
          $templateCache.put('modules/characters/client/views/view-character.client.view.html', '');

          // create mock Character
          mockCharacter = new CharactersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Character Name',
            playableClass: [{
              profession: {
                name: 'Baker',
                hitDice: 6
              },
              attributes: {
                Constitution: 5
              }
            }],
            attributes: {
              Strength: 8,
              Dexterity: 8,
              Constitution: 8,
              Intelligence: 8,
              Wisdom: 8,
              Charisma: 8
            },
            race: {
              abilityIncreases: []
            }
          });

          Authentication.user = {
            roles: ['user']
          };

          //Initialize Controller
          CharactersController = $controller('CharactersController as vm', {
            $scope: $scope,
            characterResolve: mockCharacter
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:characterId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.characterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            characterId: 1
          })).toEqual('/characters/1');
        }));

        it('should attach an Character to the controller scope', function () {
          expect($scope.vm.character._id).toBe(mockCharacter._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/characters/client/views/view-character.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CharactersController,
          mockCharacter;

        beforeEach(inject(function ($controller, $state, $templateCache, Authentication) {
          createstate = $state.get('characters.create');
          $templateCache.put('modules/characters/client/views/form-character.client.view.html', '');

          // create mock Character
          mockCharacter = new CharactersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Character Name',
            playableClass: [{
              profession: {
                name: 'Baker',
                hitDice: 6
              },
              attributes: {
                Constitution: 5
              }
            }],
            attributes: {
              Strength: 8,
              Dexterity: 8,
              Constitution: 8,
              Intelligence: 8,
              Wisdom: 8,
              Charisma: 8
            },
            race: {
              abilityIncreases: []
            }
          });

          Authentication.user = {
            roles: ['user']
          };

          //Initialize Controller
          CharactersController = $controller('CharactersController as vm', {
            $scope: $scope,
            characterResolve: mockCharacter
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.characterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/characters/create');
        }));

        it('should attach an Character to the controller scope', function () {
          expect($scope.vm.character._id).toBe(mockCharacter._id);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/characters/client/views/form-character.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CharactersController,
          mockCharacter;

        beforeEach(inject(function ($controller, $state, $templateCache, Authentication) {
          editstate = $state.get('characters.edit');
          $templateCache.put('modules/characters/client/views/form-character.client.view.html', '');

          // create mock Character
          mockCharacter = new CharactersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Character Name'
          });

          Authentication.user = {
            roles: ['user']
          };

          //Initialize Controller
          CharactersController = $controller('CharactersController as vm', {
            $scope: $scope,
            characterResolve: mockCharacter
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:characterId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.characterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            characterId: 1
          })).toEqual('/characters/1/edit');
        }));

        it('should attach an Character to the controller scope', function () {
          expect($scope.vm.character._id).toBe(mockCharacter._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/characters/client/views/form-character.client.view.html');
        });

        it('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
