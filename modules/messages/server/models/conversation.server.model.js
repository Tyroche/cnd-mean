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
  isPrivate: { type: Boolean, default: true },
  participants: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

mongoose.model('Conversation', ConversationSchema);
