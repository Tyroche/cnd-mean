'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Episode Schema
 */
var EpisodeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Episode name',
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

mongoose.model('Episode', EpisodeSchema);
