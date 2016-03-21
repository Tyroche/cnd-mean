(function () {
  'use strict';

  angular
    .module('characters')
    .factory('CharacterSourceService', CharacterSourceService);

  CharacterSourceService.$inject = [];

  function CharacterSourceService(/*Example: $state, $window */) {

    return {
      getSteps: function() {
        return [
          {
            title: 'Basics',
            template: 'modules/characters/client/views/creationSteps/character.creation.basics.view.html',
            help:'modules/characters/client/views/creationHelp/character.creation.basics.help.view.html'
          },
          {
            title: 'Attributes',
            template: 'modules/characters/client/views/creationSteps/character.creation.attributes.view.html' ,
            help:'modules/characters/client/views/creationHelp/character.creation.attributes.help.view.html'
          },
          {
            title: 'Background',
            template: 'modules/characters/client/views/creationSteps/character.creation.background.view.html' ,
            help:'modules/characters/client/views/creationHelp/character.creation.background.help.view.html'
          },
          {
            title: 'Inventory',
            template: 'modules/characters/client/views/creationSteps/character.creation.inventory.view.html' ,
            help:'modules/characters/client/views/creationHelp/character.creation.inventory.help.view.html'
          }
        ];
      },

      getSkills: function () {
        return [{
            name: 'Strength',
            skills: ['Athletics']
          }, {
            name: 'Dexterity',
            skills: ['Acrobatics', 'Sleight of Hand', 'Stealth']
          }, {
            name: 'Constitution',
            skills: []
          }, {
            name: 'Intelligence',
            skills: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion']
          }, {
            name: 'Wisdom',
            skills: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival']
          }, {
            name: 'Charisma',
            skills: ['Deception', 'Intimidation', 'Perform', 'Persuasion']
        }];
      }
    };
  }
})();
