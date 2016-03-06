'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Configuration = mongoose.model('Configuration'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Configuration
 */
exports.create = function(req, res) {
  var configuration = new Configuration(req.body);
  configuration.user = req.user;

  configuration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(configuration);
    }
  });
};

/**
 * Show the current Configuration
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var configuration = req.configuration ? req.configuration.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  configuration.isCurrentUserOwner = req.user && configuration.user && configuration.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(configuration);
};

/**
 * Update a Configuration
 */
exports.update = function(req, res) {
  var configuration = req.configuration ;

  configuration = _.extend(configuration , req.body);

  configuration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(configuration);
    }
  });
};

/**
 * Delete an Configuration
 */
exports.delete = function(req, res) {
  var configuration = req.configuration ;

  configuration.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(configuration);
    }
  });
};

/**
 * List of Configurations
 */
exports.list = function(req, res) { 
  Configuration.find().sort('-created').populate('user', 'displayName').exec(function(err, configurations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(configurations);
    }
  });
};

/**
 * Configuration middleware
 */
exports.configurationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Configuration is invalid'
    });
  }

  Configuration.findById(id).populate('user', 'displayName').exec(function (err, configuration) {
    if (err) {
      return next(err);
    } else if (!configuration) {
      return res.status(404).send({
        message: 'No Configuration with that identifier has been found'
      });
    }
    req.configuration = configuration;
    next();
  });
};
