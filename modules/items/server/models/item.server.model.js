'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Item name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Item description'
  },
  rarity: {
    type: String,
    enum: [
      'Common',
      'Uncommon',
      'Rare',
      'Very Rare',
      'Legendary',
      'Artifact',
      'Unique'
    ],
    default: 'Common'
  },
  classification: {
    type: String,
    enum: [
      'Armor',
      'Component',
      'Currency',
      'Kit',
      'Potion',
      'Ring',
      'Scroll',
      'Staff',
      'Tool',
      'Wand',
      'Weapon',
      'Wondrous Item'
    ]
  },
  creator: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0,
    required: 'An item must have a value'
  },
  details: [{
    type: String
  }]
});

mongoose.model('Item', ItemSchema);
