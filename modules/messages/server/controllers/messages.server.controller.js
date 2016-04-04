'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Message
 */
exports.create = function(req, res) {
  var message = new Message(req.body);
  message.user = req.user;

  message.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(message);
    }
  });
};

/**
 * Show the current Message
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var message = req.message ? req.message.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  message.isCurrentUserOwner = req.user && message.user && message.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(message);
};

/**
 * Update a Message
 */
exports.update = function(req, res) {
  var message = req.message ;

  message = _.extend(message , req.body);

  message.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(message);
    }
  });
};

/**
 * Delete an Message
 */
exports.delete = function(req, res) {
  var message = req.message ;

  message.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(message);
    }
  });
};

/**
 * List of Messages
 */
exports.list = function(req, res) {
  // find only messages that we can see
  Message.find({
    $or: [
      { sender: req.user._id },
      { publicity: 'public' },
      { participants: { '$in': [req.user._id] } }
    ]
  }).sort('-created').populate('user', 'displayName').exec(function(err, messages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(messages);
    }
  });
};

// Gets all Messages by context
exports.messagesByContext = function(req, res) {
  if(req.query.dateTime) {
    return messagesByContextSinceTime(req, res, req.query.dateTime);
  }

  getSpecificMessages({
    $and: [
      { context: req.contextId },
      { $or: [
        { sender: req.user._id },
        { publicity: 'public' },
        { participants: { '$in': [req.user._id] } }
      ]
    }]
  }, req, res);
};

// Gets Messages by Context that happened since last query
function messagesByContextSinceTime(req, res, since) {
  getSpecificMessages({
    $and: [
      { context: req.contextId },
      { created: { $gt: since } },
      { $or: [
        { sender: req.user._id },
        { publicity: 'public' },
        { participants: { '$in': [req.user._id] } }
      ]
    }]
  }, req, res);
}

// Run a query for multiple messages
function getSpecificMessages(query, req, res) {
  Message.find(query).populate('sender', 'firstName lastName profileImageURL').exec(function (err, messages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(messages);
    }
  });
}

/**
 * Message middleware
 */
exports.messageByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Message is invalid'
    });
  }

  Message.findById(id).populate('sender', 'displayName').exec(function (err, message) {
    if (err) {
      return next(err);
    } else if (!message) {
      return res.status(404).send({
        message: 'No Message with that identifier has been found'
      });
    }
    req.message = message;
    next();
  });
};

/**
 * Message middleware
 */
exports.validateContextId = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Message is invalid'
    });
  }

  req.contextId = id;
  next();
};
