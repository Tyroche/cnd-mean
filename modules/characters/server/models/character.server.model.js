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
  playableClass: [{
    profession: {
      type: Schema.ObjectId,
      ref: 'Profession'
    },
    level: {
      type: Number,
      default: 1
    }
  }],
  race: {
    type: Schema.ObjectId,
    ref: 'Race'
  },
  attributes: {
    Strength: { type: Number, default: 10 },
    Dexterity: { type: Number, default: 10 },
    Constitution: { type: Number, default: 10 },
    Intelligence: { type: Number, default: 10 },
    Wisdom: { type: Number, default: 10 },
    Charisma: { type: Number, default: 10 }
  },
  hitpoints: {
    type: Number,
    default: 1
  },
  skills: [{
    type: String,
    default: ''
  }],
  created: {
    type: Date,
    default: Date.now
  },
  funds: {
    type: Number,
    default: 0
  },
  items: [{
    type: Schema.ObjectId,
    ref: 'Item'
  }],
  background: {
    generalization: { type: Schema.ObjectId, ref: 'Background' },
    appearance : { type: String },
    backstory: { type: String },
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
