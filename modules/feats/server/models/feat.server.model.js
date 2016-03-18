'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Feat Schema
 */
var FeatSchema = new Schema({
  name: {
    type: String,
    required: 'Feat name is required'
  },
  description:  {
    type: String,
    required: 'Feat description is required'
  }
});

mongoose.model('Feat', FeatSchema);
