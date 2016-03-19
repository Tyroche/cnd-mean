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
    Strength: { type: Number, default: 0 },
    Dexterity: { type: Number, default: 0 },
    Constitution: { type: Number, default: 0 },
    Intelligence: { type: Number, default: 0 },
    Wisdom: { type: Number, default: 0 },
    Charisma: { type: Number, default: 0 },
    Choice: { type: Number, default: 0 }
  }
});

mongoose.model('Race', RaceSchema);
