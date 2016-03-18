'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Race Schema
 */
var RaceSchema = new Schema({
  name: {
    type: String,
    required: 'Race name must be defined'
  },
  description: {
    type: String,
    required: 'A race description is required'
  },
  traits: [{
    type: String
  }],
  abilityIncreases: {
    strength: { type: Number, default: 0 },
    dexterity: { type: Number, default: 0 },
    constitution: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    wisdom: { type: Number, default: 0 },
    charisma: { type: Number, default: 0 },
    choice: { type: Number, default: 0 }
  }
});

mongoose.model('Race', RaceSchema);
