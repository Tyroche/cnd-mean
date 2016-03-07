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
  maxAttendees: {
    type: Number,
    required: 'You must specify the maximum number of attendees'
  },
  contracts: [{
    type: Schema.ObjectId,
    ref: 'Contract'
  }],
  sessionDate: {
    type: Date,
    default: Date.now
  },
  attendees: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

mongoose.model('Episode', EpisodeSchema);
