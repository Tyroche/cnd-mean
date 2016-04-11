'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Conversation = mongoose.model('Conversation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Conversation
 */
exports.create = function(req, res) {
  var conversation = new Conversation(req.body);
  conversation.user = req.user;

  conversation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(conversation);
    }
  });
};

/**
 * Show the current Conversation
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var conversation = req.conversation ? req.conversation.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  conversation.isCurrentUserOwner = req.user && conversation.user && conversation.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(conversation);
};

/**
 * Update a Conversation
 */
exports.update = function(req, res) {
  var conversation = req.conversation ;

  conversation = _.extend(conversation , req.body);

  conversation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(conversation);
    }
  });
};

/**
 * Delete an Conversation
 */
exports.delete = function(req, res) {
  var conversation = req.conversation ;

  conversation.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(conversation);
    }
  });
};


/**
 * List of Messages
 */
exports.list = function(req, res) {
  // find only messages that we can see
  Conversation.find({
    $or: [
      { publicity: 'public' },
      { participants: { '$in': [req.user._id] } }
    ]
  }).sort('-name').populate('participants', 'firstName lastName').exec(function(err, conversations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(conversations);
    }
  });
};

/**
 * Conversation middleware
 */
exports.conversationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Conversation is invalid'
    });
  }

  Conversation.findById(id).populate('user', 'displayName').exec(function (err, conversation) {
    if (err) {
      return next(err);
    } else if (!conversation) {
      return res.status(404).send({
        message: 'No Conversation with that identifier has been found'
      });
    }
    req.conversation = conversation;
    next();
  });
};
