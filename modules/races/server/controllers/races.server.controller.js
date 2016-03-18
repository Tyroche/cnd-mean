'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Race = mongoose.model('Race'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Race
 */
exports.create = function(req, res) {
  var race = new Race(req.body);
  race.user = req.user;

  race.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(race);
    }
  });
};

/**
 * Show the current Race
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var race = req.race ? req.race.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  race.isCurrentUserOwner = req.user && race.user && race.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(race);
};

/**
 * Update a Race
 */
exports.update = function(req, res) {
  var race = req.race ;

  race = _.extend(race , req.body);

  race.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(race);
    }
  });
};

/**
 * Delete an Race
 */
exports.delete = function(req, res) {
  var race = req.race ;

  race.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(race);
    }
  });
};

/**
 * List of Races
 */
exports.list = function(req, res) { 
  Race.find().sort('-created').populate('user', 'displayName').exec(function(err, races) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(races);
    }
  });
};

/**
 * Race middleware
 */
exports.raceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Race is invalid'
    });
  }

  Race.findById(id).populate('user', 'displayName').exec(function (err, race) {
    if (err) {
      return next(err);
    } else if (!race) {
      return res.status(404).send({
        message: 'No Race with that identifier has been found'
      });
    }
    req.race = race;
    next();
  });
};
