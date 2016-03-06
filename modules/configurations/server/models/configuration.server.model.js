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
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Configuration', ConfigurationSchema);
