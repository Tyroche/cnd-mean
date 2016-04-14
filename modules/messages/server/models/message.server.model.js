'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
  sender: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'A message cannot be posted anonymously'
  },
  character: {
    type: Schema.ObjectId,
    ref: 'Character'
  },
  contents: {
    type: String,
    default: '',
    required: 'Message cannot be empty',
  },
  participants: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  publicity: {
    type: String,
    enum: [
      'public',
      'group',
      'private'
    ],
    default: 'private'
  },
  context: {
    type: Schema.ObjectId,
    required: 'A Context must be supplied'
  },
  format: {
    type: String,
    enum: [
      'roll',
      'emote',
      'message'
    ]
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Message', MessageSchema);
