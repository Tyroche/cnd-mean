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
  isOpen: {
    type: Boolean,
    default: true
  },
  summary: {
    type: String
  },
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
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    character: {
      type: Schema.ObjectId,
      ref: 'Character'
    },
    contractVote: {
      type: Schema.ObjectId,
      ref: 'Contract'
    },
    selected: { type: Boolean }
  }]
});

mongoose.model('Episode', EpisodeSchema);
