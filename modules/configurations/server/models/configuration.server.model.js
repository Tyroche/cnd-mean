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
  }]
});

mongoose.model('Configuration', ConfigurationSchema);
