'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Background = mongoose.model('Background'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Background
 */
exports.create = function(req, res) {
  var background = new Background(req.body);
  background.user = req.user;

  background.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(background);
    }
  });
};

/**
 * Show the current Background
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var background = req.background ? req.background.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  background.isCurrentUserOwner = req.user && background.user && background.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(background);
};

/**
 * Update a Background
 */
exports.update = function(req, res) {
  var background = req.background ;

  background = _.extend(background , req.body);

  background.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(background);
    }
  });
};

/**
 * Delete an Background
 */
exports.delete = function(req, res) {
  var background = req.background ;

  background.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(background);
    }
  });
};

/**
 * List of Backgrounds
 */
exports.list = function(req, res) { 
  Background.find().sort('-created').populate('user', 'displayName').exec(function(err, backgrounds) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(backgrounds);
    }
  });
};

/**
 * Background middleware
 */
exports.backgroundByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Background is invalid'
    });
  }

  Background.findById(id).populate('user', 'displayName').exec(function (err, background) {
    if (err) {
      return next(err);
    } else if (!background) {
      return res.status(404).send({
        message: 'No Background with that identifier has been found'
      });
    }
    req.background = background;
    next();
  });
};
