'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contract Schema
 */
var ContractSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Contract name',
    trim: true
  },
  elected: {
    type: Boolean,
    default: false
  },
  enabled: {
    type: Boolean,
    default: true
  },
  client: {
    type: String,
    default: '',
    required: 'Client name is required',
    trim: true
  },
  details: {
    type: String,
    default: '',
    required: 'Details are required',
    trim: true
  },
  rewards: [{
    unit: {
      type: String,
      default: 'riphons',
      required: 'Units are required'
    },
    amount: {
      type: Number,
      default: 0,
      required: 'Reward amount is required'
    },
    condition: { type: String }
  }],
  expectedPlayStyles: [{
    type: String
  }],
  voters: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

mongoose.model('Contract', ContractSchema);
