'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Wiki Schema
 */
var WikiSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Wiki name',
    trim: true
  },
  sections: [{
    title: { type: String },
    content: { type: String }
  }]
});

mongoose.model('Wiki', WikiSchema);
