'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Configuration Schema
 */
var ConfigurationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Configuration name',
    trim: true
  },
  enabled: {
    type: Boolean,
    required: 'Enabled/Disabled cannot be ambiguous',
    default: false
  },
  maximumSessionSize: {
    type: Number,
    required: 'You must specify a maximum Session Size',
    default: 5
  },
  currencies: [{
    relativeValue: {
      type: Number,
      required: 'Relative value must be defined',
      default: 1
    },
    unit: {
      type: String,
      required: 'The unit (plural) must be defined',
      default: 'gold'
    }
  }],
  classes: [{
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
    skillProficiencies: [{
      type: String
    }],
    saveProficiencies: [{
      type: String
    }]
  }],
  races: [{
    name: {
      type: String,
      required: 'Race name must be defined'
    },
    description: {
      type: String,
      required: 'A race description is required'
    },
    skillProficiencies: [{
      type: String
    }],
    abilityIncreases: [{
      ability: { type: String },
      amount: { type: Number }
    }]
  }]
});

mongoose.model('Configuration', ConfigurationSchema);
