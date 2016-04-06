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
  description: {
    type: String,
    required: 'Spell description is required'
  },
  duration: { type: Number },
  target: { type: String },
  range: { type: String },
  components: { type: String },
  castTime: { type: String },
  school: { type: String },
  level: { type: Number }
});

mongoose.model('Spell', SpellSchema);
