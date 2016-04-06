'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Spell Schema
 */
var SpellSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Spell name',
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

mongoose.model('Spell', SpellSchema);
