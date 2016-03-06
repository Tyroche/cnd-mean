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
      type: String,
      required: 'HD must be defined'
    },
    skillProficiencies: [{
      type: String
    }],
    saveProficiencies: [{
      type: String
    }]
  }]
});

mongoose.model('Configuration', ConfigurationSchema);
