'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Background Schema
 */
var BackgroundSchema = new Schema({
  name: {
    type: String,
    required: 'Background name must be defined'
  },
  description: {
    type: String,
    required: 'Background description is required'
  },
  startingFunds: {
    type: Number,
    default: 10
  },
  traits: [{ type: String }],
  ideals: [{ type: String }],
  bonds: [{ type: String }],
  flaws: [{ type: String }]
});

mongoose.model('Background', BackgroundSchema);
