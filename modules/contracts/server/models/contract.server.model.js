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
  rewards: {
    type: String,
    default: '',
    required: 'Rewards are required',
    trim: true
  },
  expectedPlayStyle: [{
    type: String
  }],
  voters: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

mongoose.model('Contract', ContractSchema);
