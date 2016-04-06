'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Profession Schema
 */
var ProfessionSchema = new Schema({
  name: {
    type: String,
    required: 'Class name must be defined'
  },
  description: {
    type: String,
    required: 'A class description is required'
  },
  hitDice: {
    type: Number,
    required: 'HD must be defined'
  },
  archetypeLevelRequirement: {
    type: Number,
    default: 3
  },
  archetypes: [{
    title: {
      type: String,
      default: 'Universal'
    },
    description: {
      type: String,
      default: 'The generic archetype; all archetypes benefit from traits here'
    },
    spellcasting: {
      isSpellCaster: { type: Boolean },
      spells: [{ type: Schema.ObjectId, ref: 'Spell' }],
      ability: {
        type: String,
        enum: [
          'Strength',
          'Dexterity',
          'Constitution',
          'Intelligence',
          'Wisdom',
          'Charisma'
        ]
      }
    },
    traits: [{
      title: { type: String },
      description: { type: String },
      levelRequirement: { type: Number },
      obsoleteAtLevel: { type: Number, default: 0 },
      numChoices: { type: Number },
      choices: [{
        title: { type: String },
        description: { type: String }
      }]
    }]
  }],
  skillProficiencies: [{
    type: String,
    enum: [
      'Athletics',
      'Acrobatics',
      'Sleight of Hand',
      'Stealth',
      'Arcana',
      'History',
      'Investigation',
      'Nature',
      'Religion',
      'Animal Handling',
      'Insight',
      'Medicine',
      'Perception',
      'Survival',
      'Deception',
      'Intimidation',
      'Perform',
      'Persuasion'
    ]
  }],
  numSkillProficiencies: {
    type: Number,
    default: 2
  },
  saveProficiencies: [{
    type: String,
    enum: [
      'Strength',
      'Dexterity',
      'Constitution',
      'Intelligence',
      'Wisdom',
      'Charisma'
    ]
  }]
});

mongoose.model('Profession', ProfessionSchema);
