'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Episode = mongoose.model('Episode'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Episode
 */
exports.create = function(req, res) {
  var episode = new Episode(req.body);
  episode.user = req.user;

  episode.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(episode);
    }
  });
};

/**
 * Show the current Episode
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var episode = req.episode ? req.episode.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  episode.isCurrentUserOwner = req.user && episode.user && episode.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(episode);
};

/**
 * Update a Episode
 */
exports.update = function(req, res) {
  var episode = req.episode ;

  episode = _.extend(episode , req.body);

  episode.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(episode);
    }
  });
};

/**
 * Delete an Episode
 */
exports.delete = function(req, res) {
  var episode = req.episode ;

  episode.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(episode);
    }
  });
};

/**
 * List of Episodes
 */
exports.list = function(req, res) {
  Episode.find().sort('-created').populate('attendees').populate('contracts name').populate('user', 'displayName').exec(function(err, episodes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(episodes);
    }
  });
};

/**
 * Episode middleware
 */
exports.episodeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Episode is invalid'
    });
  }

  Episode.findById(id).populate('attendees.user', 'firstName lastName').populate('contracts attendees.character attendees.contractVote').exec(function (err, episode) {
    if (err) {
      return next(err);
    } else if (!episode) {
      return res.status(404).send({
        message: 'No Episode with that identifier has been found'
      });
    }
    req.episode = episode;
    next();
  });
};
