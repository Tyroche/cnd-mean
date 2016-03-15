'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Character Schema
 */
var CharacterSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please provide a Character name',
    trim: true
  },
  level: {
    type: Number,
    default: 1,
    required: 'Level must be specified'
  },
  playableClass: {
    type: String,
    default: 'Commoner'
  },
  race: {
    type: String,
    default: 'Human'
  },
  attributes: {
    strength: { type: Number, default: 10 },
    dexterity: { type: Number, default: 10 },
    constitution: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    wisdom: { type: Number, default: 10 },
    charisma: { type: Number, default: 10 }
  },
  saves: [{
    type: String,
    default: ''
  }],
  skills: [{
    type: String,
    default: ''
  }],
  created: {
    type: Date,
    default: Date.now
  },
  items: [{
    type: Schema.ObjectId,
    ref: 'Item'
  }],
  background: {
    appearance : { type: String },
    backstory: { type: String },
    generalization: { type: String },
    trait: { type: String },
    ideal: { type: String },
    bond: { type: String },
    flaw: { type: String }
  },
  player: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Character', CharacterSchema);
