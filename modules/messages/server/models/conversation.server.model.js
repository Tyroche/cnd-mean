'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Conversation Schema
 */
var ConversationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Conversation name',
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

mongoose.model('Conversation', ConversationSchema);
